import express , { NextFunction, Request , Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { createContent, CreateUser, deleteContent, editshare, findContent, findUser, loginschema, ShareLink, UserSchema , contentSchema } from "./db";
import { auth } from "./middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config()

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        error : {
            msg : "Internal server error",
            code : 500
        }
    });
});


app.post('/api/v1/signup',async (req: Request ,res: Response) => {
    const validation = UserSchema.safeParse(req.body);
    if(!validation.success){
        res.status(400).json({
            msg : "invlaid input",
            code : 400
        });
        return
    }
    const { username , password , name } = validation.data;
    try{
        const hpass = await bcrypt.hash(password,8);
        const user = await CreateUser( username , hpass , name );
        if(!user){
            res.status(409).json({
                msg : "username already exits",
                code : 409
            });
            return
        }

        res.status(200).json({
            msg : "signup sucess",
            code : 200
        });

    }catch (error) {
        res.status(500).json({
            error : {
                msg : "failed to create user",
                code : 500,
                error
            },
        });
    }
});

app.post('/api/v1/signin',async (req: Request,res: Response) => {
    const validation = loginschema.safeParse(req.body);
    if(!validation.success){
        res.status(400).json({
            error : {
                msg : "Invalid input",
                code : 400
            }
        });
        return;
    }

    const { username , password } = validation.data;

    try{
        const user = await findUser(username);
        if (!user) {
            res.status(404).json({
                error : {
                    msg : "Username not found",
                    code : 404
                },
            });
            return;
        }
        const IsvalidPass = await bcrypt.compare(password,user.password);
        if (!IsvalidPass) {
            res.status(401).json({
                error : {
                    msg : "Incorect password",
                    code : 401,
                }
            });
            return;
        }

        const token = jwt.sign({ userid : user.id}, process.env.JWT_SECRET!,{
            expiresIn: "1h",
        });

        res.status(200).json({
            msg : "Login successful",
            code : 200,
            token : token,
        });
    }catch (error) {
        res.status(500).json({
            error: {
                msg : "Failed to authenticate",
                code : 500,
                error
            }
        });
    }
});

app.post('/api/v1/content', auth ,async (req: Request ,res: Response) => {
    const validation = contentSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            error : {
                msg : "Invalid input",
                code : 400
            }
        });
        return;
    }
    const { title , link , description } = validation.data;
    const userid = req.userId as string;
    try{
        await createContent(title,link, userid , description)
        res.status(200).json({
            msg : "content sucessfully created"
        });
    }catch (error) {
        res.status(500).json({
            error : {
                msg :" Failed to create content",
                code : 500,
                error
            }
        });
    }
});

app.get('/api/v1/content', auth ,async (req: Request ,res: Response) => {

    const userid = req.userId as string;
    try {
        const content = await findContent(userid);
        res.status(200).json({
            msg : "content fetched successfully",
            content
        });
    }catch (error) {
        res.status(500).json({
            error : {
                msg : 'Failed to get data',
                code: 500,
                error
            },
        });
    }
});

app.delete('/api/v1/content/:contentid', auth ,async (req: Request ,res: Response) => {
    const contentid = req.params.contentid as string;
    const userid = req.userId as string;
    try{
        const del = await deleteContent(userid,contentid)
        if(!del){
            res.status(404).json({
                msg : "content id not exits ",
                code : 404
            });
            return
        }
        res.status(200).json({
            msg : "content deleted successfully",
            content : del
        });
    }catch(error){
        res.status(500).json({
            error: {
                msg : "Failed to delete content",
                code : 500,
                error
            },
        });
    }
    
});

app.post('/api/v1/brain/Share', auth ,async (req: Request ,res: Response) => {

    const userid = req.userId as string;
    try{
        const val = await editshare(userid)
        res.status(200).json({
            msg : 'Share is updated',
            share : val
        });
    }catch(error){
        res.status(500).json({
            error : {
                msg : "Failed to update share settings",
                code : 500,
                error
            }
        });
    }
});

app.get('/api/v1/brain/:username',auth,async (req: Request ,res: Response) => {
    const username = req.params.username as string;
    try {
        const result = await ShareLink(username);
        if (result === false) {
            res.status(404).json({
                error: {
                    msg : "Username not found",
                    code: 404,
                },
            });
        }
        if (result === "user_not_want") {
            res.status(403).json({
                error: {
                    msg : "User has disabled sharing",
                    code : 403,
                },
            });
        }
        res.status(200).json({
            msg : "Content fetched successfilly",
            content: result
        });
    } catch (error) {
        res.status(500).json({
            error : {
                msg : "Failed to get user content ",
                code : 500,
                error,
            },
        });
    }
});


app.listen(3000,() => {
    console.log('u r on port 3000')
});