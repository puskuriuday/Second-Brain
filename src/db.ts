import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import sanitizeHtml from 'sanitize-html';

const client = new PrismaClient;

const sanitizeOptions = {
    allowedTags : [], // not allows any HTML tag as input
    allowedAttributes : {}
}

interface User {
    id : string,
    username : string,
    name: string,
    password : string,
    share : boolean
}

interface Content {
    id : string,
    title : string,
    link : string,
    description : string,
    UserId : string
}

export async function CreateUser(username: string , password:string, name: string): Promise<boolean>{
    const user = await client.user.findFirst({
        where:{
            username: username
        }
    });

    if (user) {
        return false
    } 

    await client.user.create({
        data : {
            username,
            password,
            name,
            share: false
        },
    });

    return true;
}


export async function findUser(username: string): Promise<User | null> {
    const user = await client.user.findFirst({
        where:{
            username: username
        }
    });

    return user
}

export async function createContent(title: string , type: string , link: string , UserId: string , description: string ): Promise<void> {
    // to avoid xss 
    const sanitizedData = {
        title: sanitizeHtml(title, sanitizeOptions),
        type: sanitizeHtml(type, sanitizeOptions),
        link: sanitizeHtml(link, sanitizeOptions),
        description: sanitizeHtml(description, sanitizeOptions),
      };
    // adds begin and commit better pratice
    await client.$transaction([
        client.content.create({
            data : {
                ...sanitizedData,
                UserId
            },
        }),
    ]);
}

export async function findContent(userid: string): Promise<Content[] | null>{
    const content = await client.content.findMany({
        where:{
            UserId : userid
        }
    });
    return content;
}

export async function deleteContent(userid: string , contentid: string): Promise<Content | null> {
    try{
        const del: Content = await client.content.delete({
            where: {
                id : contentid,
                UserId : userid
            }
        });
        return del
    }catch(error: any){
        return null
    }
}

export async function editshare(userid: string): Promise<boolean> {
    const chk: User | null = await client.user.findFirst({
        where: {
            id: userid
        }
    });

    if (!chk) {
        throw new Error("User not found");
    }

    const updateShare: User = await client.user.update({
        where: {
            id: userid
        },
        data: {
            share: !chk.share
        }
    });
    return updateShare.share;
}

export async function ShareLink(username: string):Promise<Content[] | false | 'user_not_want'> {
    const user = await client.user.findFirst({
        where: {
            username
        }
    });
    if (!user){
        return false;
    }

    if (!user.share){
        return 'user_not_want';
    }

    const content = await client.content.findMany({
        where: {
            UserId : user.id
        }
    });
    return content;
}


export const UserSchema = z.object({
    name     : z.string().min(3).max(10),
    username : z.string().min(6).max(10),
    password : z.string().min(8).max(20)
});

export const loginschema = z.object({
    username : z.string().min(6).max(10),
    password : z.string().min(8).max(20)
});

export const contentSchema = z.object({
    title: z.string().min(1).max(50),
    type: z.string().min(1).max(20),
    link: z.string().url(),
    description: z.string().max(500)
});