import express, { Response,Request } from 'express'
import cors from "cors";
import dotenv from 'dotenv'
import { sql } from './db';
import authRoutes from './routes/auth.routes'; // Adjust path if needed
import rateLimiter from './middleware/rateLimiter';
import job from './cron';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(rateLimiter)
app.use(express.json())
app.use("/auth",authRoutes)
if(process.env.NODE === "production") {
  job.start();
}

app.get("/api/health",(req,res) => {
  res.status(200).json({status:"ok"})
})
async function DBinit() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `;
  
      await sql`
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          category VARCHAR(255) NOT NULL,
          created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )
      `;
      
      console.log("Database initialized successfully");
    } catch (error) {
      console.log("Error initializing", error);
      process.exit(1);
    }
  }
  

  app.get("/api/transactions/:userId",async(req:Request,res:Response) => {
    try {
        const {userId} = req.params;
        const transaction = await sql`SELECT * FROM transactions WHERE user_id=${userId} `;
        res.status(200).json({
            transaction
        })
    }
    catch(error) {
        console.log(error);
        
    }
  })
//@ts-ignore
  app.delete("/api/transactions/:id",async(req,res) => {
    const {id} = req.params;
    if(isNaN(parseInt(id))) {
        return res.status(400).json({
            message:"invalid id"
        })
    }
    const transaction = await sql `DELETE FROM transactions WHERE id=${id} RETURNING *`

    if(transaction.length === 0) {
        return res.status(400).json({
            message:"not found"
        })
    }
    res.status(200).json({
        message:"success deleted",
        transaction
    })
  })

  app.get("/api/transactions/summary/:user_id",async(req,res) =>  {
    try {
        const {user_id} = req.params; 
        const balanceResult = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE
        user_id=${user_id}`

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE
        user_id = ${user_id} AND amount > 0`

        const expensesResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE
        user_id = ${user_id} AND amount < 0`

        res.status(200).json({
            balance:balanceResult[0].balance,
            income:incomeResult[0].income,
            expenses:expensesResult[0].expenses,
        })
        
    }
    catch(error) {
        console.log("error",error);
        res.status(500).json({
            message:"internal server error"
        })
        
    }

  })
  //@ts-ignore
  app.post("/api/transactions",async(req:Request,res:Response) => {
    const {title,amount,category,user_id} = req.body;

    if(!title || amount === undefined || !category || !user_id) {
        return res.status(400).json({
            message:"All fields are required"
        })
    }
    
    const transaction = await sql`INSERT INTO transactions(user_id,title,amount,category)
    VALUES (${user_id}, ${title},${amount}, ${category})
    RETURNING *`
    
    console.log(transaction);
    
    res.status(201).json(transaction[0])
  })

DBinit().then(() => {
    app.listen(process.env.PORT,() => { 
        console.log("server is up and running on a port",PORT);
        
    })
})