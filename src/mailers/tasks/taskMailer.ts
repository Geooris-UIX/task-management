import path from "path";
import transporter from "../../config/mail";
import fs from 'fs';
import dotenv from 'dotenv';
import Handlebars from "handlebars";

dotenv.config()

export const reminderMail = async (emails: string[], taskTitle: string, taskDescription: string, taskDueDate: string) => {
    
    const templateSource = fs.readFileSync(path.join(__dirname, 'reminderMail.hbs'), 'utf-8');
    const template = Handlebars.compile(templateSource);
    const htmlContent = template({
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: emails[0],
        cc: emails.slice(1).join(", "),
        subject: `Reminder: Task "${taskTitle}" is due soon`,
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log({code: 422, message: err.message}) 
        }else {
            console.log("Reminder email sent successfully!");
        }
    })

    return true;
}