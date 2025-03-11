// Typescript types
import { Document } from "mongoose";

interface ITask extends Document {
    title: string,
    description: string,
    status: "pending" | "in progress" | "completed",
    priority: "low" | "medium" | "high",
    dueDate: Date,
    reminderSent: boolean,
    owner?: string,
    // user?: string,
    assignedUser?: string[]
}

export {ITask}