import jwt from "jsonwebtoken"
import { Request , Response , NextFunction } from "express";

export function auth(req: Request , res: Response , next: NextFunction){
    const token = req.headers['token'] as string;
    if(!token){
        res.json({
            msg : "Token not found"
        });
        return
    }else{
        const validate = jwt.verify(token,process.env.JWT_SECERET as string);
        if(!validate){
            res.json({
                msg : "invalid token"
            });
            return
        }else{
            //@ts-ignorets-ignore
            req.id = validate.id
            next()
        }
    }
}