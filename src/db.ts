import { PrismaClient } from "@prisma/client";
import { string, z } from "zod";

const client = new PrismaClient;

export async function Create_User(username: string , password:string){

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
            password
        }
    });
    return true
}

export const UserSchema = z.object({
    username : z.string().min(6).max(10),
    password : z.string().min(8).max(20)
})