import { createTransport } from "nodemailer";
import dotenv from 'dotenv'

dotenv.config();

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
});

export default transporter;