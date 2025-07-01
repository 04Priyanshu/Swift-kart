import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import ejs from "ejs";

dotenv.config()

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
})

//render template
const renderTemplate = async (templateName: string, data: Record<string, any>) : Promise<string> => {
    const templatePath = path.join(
        process.cwd(),
        "apps",
        "auth-service",
        "src",
        "utils",
        "email-templates",
        `${templateName}.ejs`
    )
    
    try {
        const html = await ejs.renderFile(templatePath, data);
        console.log("Template rendered successfully, HTML length:", html.length);
        return html;
    } catch (error) {
        console.log("Error rendering template:", error);
        throw error;
    }
}

//send email
export const sendEmail = async (to: string, subject: string, template: string, data: Record<string, any>) => {
    try {
const html = await renderTemplate(template, data);

await transport.sendMail({
    from: `<${process.env.SMTP_USER}>`,
    to,
    subject,
    html
});
return true;
    } catch (error) {
        console.log("Error in sending email", error);
        return false;
    }
}