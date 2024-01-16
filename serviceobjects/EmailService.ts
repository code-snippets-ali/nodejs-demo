const nodemailer = require("nodemailer");

export class EmailService {
    async sendEmail(options: any) {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 25,
            auth: {
                user: "65a9a4beaf0fa0",
                pass: "80a4083087ec0c",
            },
        });

        const mailOptions = {
            from: "Health App <health_app@healthapp.com>",
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // await transporter.sendMail(mailOptions);
    }
}
