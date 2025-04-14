import express , { Request , Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { z } from "zod";
import { Create_User, UserSchema } from "./db";

const app = express();

app.use(express.json());

app.post('/api/v1/signup',async (req: Request ,res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const validation = UserSchema.safeParse(req.body);
    if(!validation.success){
        res.status(411).json({
            msg : "invlaid input"
        });
        return
    }
    try{
        const hpass = await bcrypt.hash(password,3);
        const user = await Create_User(username , hpass);
        if(!user){
            res.status(403).json({
                msg : "username already exits"
            });
        }else{
            res.status(200).json({
                msg : "signup sucess"
            });
        }
    }catch(e: any){
        res.status(500).json({
            msg: "server error"
        })
    }
});

app.post('/api/v1/signin',async (req,res) => {
    
});

app.post('/api/v1/content',async (req,res) => {
    
});

app.get('/api/v1/content',async (req,res) => {
    
});

app.delete('/api/v1/content',async (req,res) => {
    
});

app.post('/api/v1/brain/Share', async (req,res) => {

});

app.get('/api/v1/brain/:ShareLink',async (req,res) => {

});

app.listen(3000,() => {
    console.log('u r on port 3000')
});