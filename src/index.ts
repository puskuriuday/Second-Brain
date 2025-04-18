import express , { Request , Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { create_content, Create_User, deletecontent, editshare, findContent, finduser, loginschema, ShareLink, UserSchema } from "./db";
import { auth } from "./middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config()

app.post('/api/v1/signup',async (req: Request ,res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const name: string = req.body.name;
    const validation = UserSchema.safeParse(req.body);
    if(!validation.success){
        res.status(411).json({
            msg : "invlaid input"
        });
        return
    }
    try{
        const hpass = await bcrypt.hash(password,4);
        const user = await Create_User( username , hpass , name );
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

app.post('/api/v1/signin',async (req: Request,res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const validation = loginschema.safeParse(req.body);
    if(!validation.success){
        res.status(411).json({
            msg :"invalid input"
        });
        return
    }
    try{
        const user = await finduser(username , password);
        if(user == null){
            res.status(403).json({
                msg : "Username not found"
            });
            return
        }if(user){
            const verifypass = await bcrypt.compare(password,user.password);
            if(!verifypass){
                res.status(300).json({
                    msg : "incorrect password"
                });
            }else{
                const token = jwt.sign({
                    id : user.id
                },process.env.JWT_SECERET as string);
                res.status(200).json({
                    msg : "login successfully",
                    token : token
                });
            }
            
        }
    }catch(e: any){
        res.status(500).json({
            msg : "Server Error"
        });
    }
});

app.post('/api/v1/content', auth ,async (req: Request ,res: Response) => {
    const { title , link , description } = req.body;
    //@ts-ignore
    const userid = req.id
    try{
        const content = await create_content(title,link, userid , description)
        res.json({
            msg : "content sucessfully created"
        });
    }catch(e){
        res.json({
            err : e
        });
    }
});

app.get('/api/v1/content', auth ,async (req: Request ,res: Response) => {
    //@ts-ignore
    const userid = req.id as string;
    try{
        const content = await findContent(userid);
        res.json({
            content
        });
    }catch(e){
        res.json({
            msg:"server error"
        });
    }
    
});

app.delete('/api/v1/content/:contentid', auth ,async (req: Request ,res: Response) => {
    const contentid = req.params.contentid as string;
    //@ts-ignore
    const userid = req.id as string;
    try{
        const del = await deletecontent(userid,contentid)
        if(!del){
            res.json({
                msg : "content id not exits"
            });
            return
        }
        res.json({
            msg : "deleted successfully",
            content : del
        });
    }catch(e){
        err : e
    }
    
});

app.post('/api/v1/brain/Share', auth ,async (req: Request ,res: Response) => {
    //@ts-ignore
    const userid = req.id as string;
    try{
        const val = await editshare(userid)
        res.json({
            msg : val.share
        })
    }catch(e){
        console.log(e);
    }
});

app.get('/api/v1/brain/:ShareLink',auth,async (req: Request ,res: Response) => {
    const username = req.params.ShareLink as string;
    const shr = await ShareLink(username)
    if(!shr){
        res.json({
            msg : "username not exits"
        });
    }
    
    if (shr == 'user_not_want'){
        res.json({
            msg : "user not wants to share"
        });
    }
    res.json({
        msg : "success",
        content : shr
    })
});


app.listen(3000,() => {
    console.log('u r on port 3000')
});