import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const client = new PrismaClient;

export async function Create_User(username: string , password:string, name: string){

    const user = await client.user.findFirst({
        where:{
            username: username
        }
    });
    if(user !== null) {
        return false
    } 

    await client.user.create({
        data : {
            username,
            password,
            name
        }
    });
    return true
}

export async function finduser(username: string , password: string) {
    const user = await client.user.findFirst({
        where:{
            username: username
        }
    });
    return user
}

export async function create_content(title: string , link: string , UserId: string , description?: string ){
    await client.content.create({
        data: {
            title,
            link,
            description,
            UserId
        }
    })
}

export async function findContent(userid: string){
    const content = await client.content.findMany({
        where:{
            UserId : userid
        }
    });
    return content;
}

export async function deletecontent(userid: string , contentid: string) {
    const con = await client.content.findFirst({
        where:{
            id:contentid
        }
    });
    
    if(!con){

        return false;
    }
    const del = await client.content.delete({
        where: {
            id : contentid,
            UserId : userid
        }
    });
    
    return del;
}

export async function editshare(userid: string) {
    const chk = await client.user.findFirst({
        where: {
            id: userid
        }
    });
    const shrval = chk?.share
    const share = await client.user.update({
        where: {
            id: userid
        },
        data: {
            share: !shrval
        }
    });
    return share;
}

export async function ShareLink(username: string):Promise<any> {
    const user = await client.user.findFirst({
        where: {
            username
        }
    });
    if (!user){
        return false
    }
    if (!user.share){
        return 'user_not_want' as string
    }
    const content = await client.content.findMany({
        where: {
            UserId : user.id
        }
    });
    return content
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