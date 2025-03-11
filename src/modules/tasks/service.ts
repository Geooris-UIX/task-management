// All the bussiness logic(controller)

import { TASK_ERRORS, STATUS, PRIORITY } from "./constants";
import { TaskModel } from "./entity";
import { assignUserToTask, createTask, deleteTask, findAllTask, findTask, updateTask } from "./repository"
import { ITask } from "./types";

const { BAD_REQUEST, TASK_NOT_FOUND, FAILED_TASK_UPDATE, PERMISSION_ERROR } = TASK_ERRORS;


export const filterTasks = async (status?: string, priority?: string, dueDate?: string, owner?: string) => {
    
    const filters: any = {
        $or: [
            { owner: owner },
            { assignedUser: owner }
        ]
    };
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (dueDate) {
        const [startDate, endDate] = dueDate.split('|')
        filters.dueDate = {}
        
        if (startDate) filters.dueDate.$gte = new Date(Number(startDate) * 1000);
        if (endDate) filters.dueDate.$lte = new Date(Number(endDate) * 1000);
        
        if(!startDate && !endDate) {
            delete filters.dueDate;
        }
    }
    const tasks = await findAllTask(filters);
    return tasks.map((task) => {
        return {
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: Math.floor(task.dueDate.getTime() / 1000),
            owner: task.owner,
            assignedUser: task.assignedUser
        }
    })
}

export const showTask = async (id: string, owner: string) => {
    if(!id) {
        throw BAD_REQUEST;
    }

    const filters: any = {
        $or: [
            { owner: owner },
            { assignedUser: owner }
        ]
    };

    const task = await findTask({_id: id, ...filters});
    if(!task) {
        throw TASK_NOT_FOUND;
    }

    return {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: Math.floor(task.dueDate.getTime() / 1000),
        owner: task.owner,
        assignedUser: task.assignedUser
    };
}

export const create = async (
    title: string,
    description: string,
    priority: ITask["priority"],
    dueDate: ITask["dueDate"],
    owner: string,
    assign_users: string[]
) => {
    if (!title || !description || !priority || !dueDate || isNaN(Number(dueDate)) || !assign_users) {
        throw BAD_REQUEST;
    }

    dueDate = new Date(Number(dueDate) * 1000);

    if(!PRIORITY.includes(priority)) {
        throw { BAD_REQUEST, ...{message: "Incorrect Priority value"} };
    }

    const data: Partial<ITask> = {
        title,
        description,
        status: "pending",
        priority,
        dueDate,
        owner,
        assignedUser: assign_users
    };
    const task = await createTask(data);

    return {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: Math.floor(task.dueDate.getTime() / 1000),
        owner: task.owner,
        assignedUser: task.assignedUser
    };
};

export const assignUser = async (id: string, new_users: string[], owner: string) => {
    const filters: any = {
        $or: [
            { owner: owner },
            { assignedUser: owner }
        ]
    };

    const task = await findTask({_id: id, ...filters});
    if(!task) {
        throw TASK_NOT_FOUND;
    }
    const updatedTask = await assignUserToTask(id, new_users);
    if(!updatedTask) {
        throw FAILED_TASK_UPDATE;
    }
    return {
        id: updatedTask._id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        dueDate: Math.floor(updatedTask.dueDate.getTime() / 1000),
        owner: updatedTask.owner,
        assignedUser: updatedTask.assignedUser
    };
}

export const update = async (
    id: string,
    updates: Partial<ITask>,
    owner: string
) => {

    if(updates.priority && !PRIORITY.includes(updates.priority)) {
        throw { BAD_REQUEST,...{message: "Incorrect Priority value"} };
    }

    if(updates.status && !STATUS.includes(updates.status)) {
        throw {BAD_REQUEST, ...{message: "Incorrect Status value"} };
    }

    const filters: any = {
        $or: [
            { owner: owner },
            { assignedUser: owner }
        ]
    };
    const task = await findTask({_id: id, ...filters});
    if(!task) {
        throw TASK_NOT_FOUND;
    }

    if(updates.owner && updates.owner !== owner){
        throw PERMISSION_ERROR;
    }

    if(updates.dueDate){
        updates.dueDate = new Date(Number(updates.dueDate) * 1000);
    }
    const updatedTask = await updateTask(id, updates);
    if(!updatedTask) {
        throw {code: FAILED_TASK_UPDATE.code, message: FAILED_TASK_UPDATE.message};
    }

    return {
        id: task._id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        dueDate: Math.floor(updatedTask.dueDate.getTime() / 1000),
        owner: updatedTask.owner,
        assignedUser: task.assignedUser
    };
};

export const destroy = async (id: string, owner: string) => {
    const task = await findTask({_id: id, owner: owner});
    if(!task) {
        throw {code: TASK_NOT_FOUND.code, message: TASK_NOT_FOUND.message};
    }
    const deletedTask = await deleteTask(id);
    if(!deletedTask) {
        throw {code: TASK_NOT_FOUND.code, message: TASK_NOT_FOUND.message};
    }
    return true;
}