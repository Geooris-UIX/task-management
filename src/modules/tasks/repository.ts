// Handles Database Queries 
import { TaskModel } from "./entity";
import { ITask } from "./types";

const findAllTask = async (filters: any = {}) => {
    return await TaskModel.find(filters)
}

const findTask = async (conditions: any = {}) => {
    return await TaskModel.findOne(conditions)
}

const createTask = async (data: Partial<ITask>) => {
    return await TaskModel.create(data)
}

const updateTask = async (id: string, data: Partial<ITask>) => {
    return await TaskModel.findByIdAndUpdate(id, data, {new: true, runValidators: true})
}

const deleteTask = async (id: string) => {
    return await TaskModel.findByIdAndDelete(id)
}

const  assignUserToTask = async (id: string, new_users: string[]) => {
    return await TaskModel.findByIdAndUpdate(
        id, 
        { $addToSet: { assignedUser: { $each: new_users } } },
        {new: true, runValidators: true})
}


export { findAllTask, findTask, createTask, updateTask, deleteTask, assignUserToTask }