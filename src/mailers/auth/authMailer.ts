import path from "path";
import transporter from "../../config/mail";
import fs from 'fs';
import Handlebars from "handlebars";

export const verificationMail = async (email: string, otp: string) => {
    
    const templateSource = fs.readFileSync(path.join(__dirname, 'verificationMail.hbs'), 'utf-8');
    const template = Handlebars.compile(templateSource);
    const htmlContent = template({
        otp: otp
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Please Verify your email`,
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