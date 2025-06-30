import {neon} from "@neondatabase/serverless"
import "dotenv/config";

//@ts-ignore
export const sql = neon(process.env.DATABASE_URL)