import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sql } from '../db';

const router = express.Router();

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}



router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
        const existingUser = await sql`SELECT * FROM USERS WHERE email = ${email}`;
  
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql`INSERT INTO USERS (email, password) VALUES (${email}, ${hashedPassword})`;
  
        const token = jwt.sign({ email }, SECRET, { expiresIn: "7d" });
  
        return res.status(201).json({
            message: "User created",
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Problem during registration" });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    try {
        const userCheck = await sql`SELECT * FROM USERS WHERE email = ${email}`;
        
        if (userCheck.length === 0) {
            return res.status(400).json({
                message: "user not found"
            });
        }
        
        const user = userCheck[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign({ email: user.email, id: user.id }, SECRET, { expiresIn: "7d" });
        
        return res.status(200).json({
            message: "login successful",
            token,
            user: { email: user.email, id: user.id }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error during login' });
    }
});

export default router;