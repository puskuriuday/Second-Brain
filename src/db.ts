import { PrismaClient } from "@prisma/client";

const client = new PrismaClient;

export async function Create_User(username: string , password:string){
    await client.user.create({
        data : {
            username,
            password
        }
    });
}


