import transporter from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

const testEmail = async () => {
    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "bhowmikakash035@gmail.com",
            subject: "HRM Portal Test Email",

            text: "Gmail SMTP is working!"
        });

        console.log("Email sent successfully!");

    } catch (error) {

        console.error(
            "Email sending failed:",
            error
        );
    }
};

export default testEmail;