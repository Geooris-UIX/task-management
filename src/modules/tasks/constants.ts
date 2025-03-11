// Stores all constants like Error message and other things

import { ITask } from "./types";

export const TASK_ERRORS = {
    BAD_REQUEST: {message: "Recieved Bad request", code: 400},
    TASK_NOT_FOUND: {message: "TASK not found for the user.", code: 404},
    FAILED_TASK_UPDATE: {message: "Failed to update Task", code: 422},
    FAILED_TASK_DELETE: {message: "Failed to delete Task", code: 422},
    PERMISSION_ERROR: {message: "You don't have permission do this", code: 422}
};

export const PRIORITY: ITask["priority"][] = ["low", "medium", "high"];
export const STATUS: ITask["status"][] = ["pending", "in progress", "completed"];