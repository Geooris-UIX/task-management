// Defines Mongoose schema and model
import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./types";

const UserSchema = new Schema<IUser>(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true, select: false},    // So the password field will not be fetched when we fetch results
        verified: {type: Boolean, required: true, default: false}
    },
    {
        timestamps: true
    }
)

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);