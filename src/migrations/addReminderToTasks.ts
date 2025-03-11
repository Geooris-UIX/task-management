import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { TaskModel } from '../modules/tasks/entity';

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || ""

const migrate = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");

        await TaskModel.updateMany(
            { reminderSent: { $exists: false } },
            { $set: { reminderSent: false } }
        );

        console.log("Migration completed successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("MongoDB connection error:", error);
        mongoose.connection.close();
    }
  };
  
migrate();