import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { TaskModel } from '../modules/tasks/entity';
import { ITask } from '../modules/tasks/types';

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || ""

const migrate = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");

        const tasks: any = await TaskModel.find({ user: { $exists: true } });

        for (const task of tasks) {

            const owner = task?.user;
            const assignedUsers = [owner]

            await TaskModel.updateOne(
                { _id: task._id},
                {
                    $set: {owner: owner, assignedUser: assignedUsers},
                    $unset: {user: ""}
                }
            );
        }
        console.log("Migration completed successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("MongoDB connection error:", error);
        mongoose.connection.close();
    }
  };
  
migrate();