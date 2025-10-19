import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';


dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Render EJS email template 
const renderEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {
    const templatepath = path.join(
        process.cwd(),
        "auth-service",
        "src",
        "utils",
        "emailTemplates",
        `${templateName}.ejs`
    );
    return ejs.renderFile(templatepath, data);
};

// send email using the nodemailer 
export const sendemail = async (to: string, subject: string, templateName: string, Data: Record<string, any>) => {
    try {
        const htmlContent = await renderEmailTemplate(templateName, Data);

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html: htmlContent,
        });
        return true;
    }
    catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
