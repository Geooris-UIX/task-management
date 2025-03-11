// Typescript types
import { Document } from "mongoose"

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    verified: boolean
}

export {IUser}