import express , { Request , Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { Create_User } from "./db";

const app = express();

app.use(express.json());

app.post('/api/v1/signup',async (req: Request ,res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    Create_User(username , password);
    res.json({
        msg : "signup sucess"
    });
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