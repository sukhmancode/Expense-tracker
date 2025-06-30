import ratelimiter from "../upstash";
//@ts-ignore
const rateLimiter = async(req,res,next) => {
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