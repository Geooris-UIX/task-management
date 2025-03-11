import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken"; 
import { findUserById } from '../auth/repository';

declare module "express" {
    export interface Request {
      currentUser?: any;
    }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "Access denied. No token provided." });
            return; 
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.currentUser = decoded;
        
        if(!req.currentUser) {
            res.status(401).json({message: "Unauthorized"})
        } 
        const user = await findUserById(req.currentUser.userId)
        if(!user)
        {
            throw {code: 401, message: "Invalid User"}
        }
        
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}