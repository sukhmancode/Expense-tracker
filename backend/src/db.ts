import {neon} from "@neondatabase/serverless"
import "dotenv/config";

const DB_URL = process.env.DATABASE_URL;

export const sql = neon(DB_URL);