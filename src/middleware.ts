import jwt, { TokenExpiredError } from "jsonwebtoken"
import { Request , Response , NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}


export function auth(req: Request , res: Response , next: NextFunction){
    const token = req.headers['token'] as string;
    if(!token){
        res.status(401).json({
            error : {
                msg : 'Authorization header missing or not found'
            }
        });
        return
    }else{
        try{
            const validate = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            req.userId = validate.userId;
            next()
        }catch(error){
            if (error instanceof TokenExpiredError){
                res.status(401).json({
                    error : {
                        msg : "Token expired",
                        code : 401
                    }
                });
                return
            }
            res.status(500).json({
                error : {
                    msg : "Authentication error" ,
                    code : 500
                }
            });
        }
    }
}