// Handles express routes
import express, { Request, Response } from "express";
import { registration, login, userInfo, update, usersList, verifyOTP, resendOTP } from "./service";
import { authenticateUser } from "../common/middleware";

const router = express.Router();

router.post("/register", async (req: Request, res: Response)=>{
    try {
        const {name, email, password, passwordConfirmation} = req.body
        const user = await registration(name, email, password, passwordConfirmation)
        res.status(201).json({
            message: "User Successfully Registered, Please verify OTP",
            date: user
        })
    } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message || "Internal Server Error" });
    }
})

router.post("/verify_otp", async (req: Request, res: Response) => {
    try {
        const {email, otp} = req.body
        const user = await verifyOTP(email as string, otp as string)
        res.status(200).json({
            message: "OTP Verified",
            date: user
        })
    } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message || "Internal Server Error" });
    }
})

router.post("/resend_otp", async (req: Request, res: Response) => {
    try {
        const {email} = req.body
        await resendOTP(email as string);
        res.status(200).json({
            message: "OTP sent again"
        })
    } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message || "Internal Server Error" });
    }
})

router.post("/login", async (req: Request, res: Response)=>{
    try {
        const {email, password} = req.body
        const token = await login(email, password)
        res.status(200).json({
            message: "Login Successfully",
            date: token
        })
    } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message || "Internal Server Error" });
    }
})

router.get('/me', authenticateUser, async (req: Request, res: Response) => {
    try {
        const user = await userInfo(req.currentUser.userId)
        
        res.status(200).json({data: user, message: "Fetched User Info"})
    } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message || "Internal Server Error" });
    }
})

router.get('/user_list', authenticateUser, async (req: Request, res: Response) => {
    try {
        const currentUserId = req.currentUser.userId
        const users = await usersList(currentUserId);
        res.status(200).json({data: users, message: "User List Fetched successfully"});
    } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message || "Internal Server Error" });
    }
})

router.put('/me/update', authenticateUser, async (req: Request, res: Response) => {
    try {
        const user = await update(req.currentUser.userId, req.body) 
        res.status(200).json({data: user, message: "User Updated successfully"});
    } catch (error: any) {
        res.status(error.code || 500).json({ error: error.message || "Internal Server Error" });
    }
})


export default router