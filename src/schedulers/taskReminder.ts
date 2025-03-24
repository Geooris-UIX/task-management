import { reminderMail } from "../mailers/tasks/taskMailer"
import { TaskModel } from "../modules/tasks/entity"

export const taskReminder = async () =>{
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const startDate = new Date(twoHoursLater.getTime() - 1 * 60 * 1000); // 5 min before
    const endDate = new Date(twoHoursLater.getTime() + 1 * 60 * 1000); // 5 min after

    const taskData: any = await TaskModel.find(
        {
            dueDate: {
                $gte: startDate,
                $lte: endDate
            },
            remainderSent: false,
        }, { _id: 1, title: 1, description: 1, dueDate: 1}).populate("owner", "name email -_id").populate("assignedUser", "name email -_id");

        taskData.map(async (data: any) => {
            
            let emails: string[] = [data.owner, ...[data.assignedUser]].map( (user) => {return user.email} )

            await reminderMail(emails, data.title, data.description, data.dueDate.toLocaleString("en-US"));
            
            await TaskModel.findByIdAndUpdate(data._id, {remainderSent: true})
        })
        
}
