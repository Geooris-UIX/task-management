// Handles express routes
import express, { Request, Response } from 'express'
import { authenticateUser } from '../common/middleware'
import { assignUser, create, destroy, filterTasks, showTask, update } from './service'

const router = express.Router()

router.get("/", authenticateUser, async (req: Request, res: Response) => {
    try {
        const {status, priority, dueDate} = req.query
        const owner = req.currentUser.userId
        const allTasks = await filterTasks(status as string, priority as string, dueDate as string, owner as string);
        res.status(200).json({data: allTasks, message: "All task loaded"});
    } catch (error: any) {
        res.status(error.code || 500).json(error.message || error.message)
    }
} )

router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
        const task = await showTask(req.params.id, req.currentUser.userId);
        res.status(200).json({data: task, message: "Task Successfully Loaded"});
    } catch (error: any) {
        res.status(error.code || 500).json(error.message || "Internal Server Error");
    }
} )

router.post("/", authenticateUser, async (req: Request, res: Response) => {
    try {
        const {title, description, priority, dueDate, assign_users} = req.body
        const currentUser = req.currentUser
        const task = await create(title, description, priority, dueDate, currentUser.userId, assign_users);
        res.status(200).json({data: task, message: "Task Created successfully"});
    } catch (error: any) {
        res.status(error.code || 500).json(error.message || "Internal Server Error");
    }
} )

router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
        const task = await update(req.params.id, req.body, req.currentUser.userId);
        res.status(200).json({data: task, message: "Task Updated successfully"});
    } catch (error: any) {
        res.status(error.code || 500).json(error.message || "Internal Server Error");
    }
})

router.put("/:id/assign_user", authenticateUser, async (req: Request, res: Response) => {
    try {
        const task = await assignUser(req.params.id, req.body?.new_users, req.currentUser.userId);
        res.status(200).json({data: task, message: "Task Assigned to new users successfully"});
    } catch (error: any) {
        res.status(error.code || 500).json(error.message || "Internal Server Error");
    }
})

router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
        const task = await destroy(req.params.id, req.currentUser.userId);
        if(task) {
            res.status(200).json({message: "Task Deleted successfully"});
        }
    } catch (error: any) {
        res.status(error.code || 500).json(error.message || "Internal Server Error");
    }
})


export default router