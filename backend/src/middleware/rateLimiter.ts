import { NextFunction, Response,Request } from "express";
import ratelimiter from "../upstash";
const rateLimiter = async(req:Request,res:Response,next:NextFunction) => {
    try {
         const {success} = await ratelimiter.limit("my-rate-limit");
        if(!success) {
            return res.status(429).json({
                message:"too many requests"
            })
        }
        next();
    }
    catch(error) {
        console.log(error,"rate limit error");
    }
}

export default rateLimiter