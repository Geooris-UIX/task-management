// Handles Database Queries 
import { UserModel } from "./entity";
import { IUser } from "./types";

const findUserByEmail = async (email:string) => {
    return await UserModel.findOne({email}).select("+password"); 
}

const findUser = async (conditions: any = {}) => {
    return await UserModel.findOne(conditions); 
}

const findAllUsers = async (currentUserId: string) => {
    return await UserModel.find(
        {_id: {$nin: currentUserId}},
        {_id: 1, name: 1}
    ).lean();
}

const createUser = async (data: Partial<IUser> ) => {
    return await UserModel.create(data);
}

const updateUser = async (id: string, data: Partial<IUser>) => {
    return await UserModel.findByIdAndUpdate(id, data, {new: true, runValidators: true});
}

export {findUserByEmail, findUser, createUser, updateUser, findAllUsers}