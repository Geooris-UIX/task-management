// Defines Mongoose schema and model
import mongoose, { Model, Schema } from "mongoose";
import { ITask } from "./types";

const TaskSchema = new Schema<ITask>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        status: {type: String, enum: ["pending", "in progress", "completed"], required: true},
        priority: {type: String, enum: ["low", "medium", "high"], required: true},
        dueDate: {type: Date, require: true},
        reminderSent: {type: Boolean, require: true, default: false},
        owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
        assignedUser: [{type: Schema.Types.ObjectId, ref: "User"}]
    },
    {
        timestamps: true
    }
)

export const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);