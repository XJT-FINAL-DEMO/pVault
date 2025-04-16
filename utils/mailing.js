import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const mailTransporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
})

export const registerUserMailTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to [Your Medical Platform]</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0066cc; padding: 20px; text-align: center; }
        .header img { max-width: 180px; }
        .content { padding: 25px; background-color: #f9f9f9; }
        .button { background-color: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }
        .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
        .divider { border-top: 1px solid #ddd; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://yourmedicalwebsite.com/logo.png" alt="[Your Medical Platform] Logo">
    </div>
    
    <div class="content">
        <h2>Welcome to [Your Medical Platform]!</h2>
        <p>Dear {{lastName}},</p>
        
        <p>Thank you for registering with [Your Medical Platform] - your new hub for seamless healthcare management. We're honored to be part of your wellness journey.</p>
        
        <h3>Get Started in 3 Easy Steps:</h3>
        <ol>
            <li><strong>Find nearby labs/pharmacies:</strong> Our verified directory helps you locate trusted providers</li>
            <li><strong>Streamline check-ins:</strong> Complete paperwork digitally before appointments</li>
            <li><strong>Access your records:</strong> Securely view visit summaries and prescriptions</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://yourmedicalwebsite.com/dashboard" class="button">Go to Your Dashboard</a>
        </div>
        
        <div class="divider"></div>
        
        <h3>Your Security Matters</h3>
        <p>We use bank-level encryption and comply with HIPAA regulations to protect your health data. Learn more in our <a href="https://yourmedicalwebsite.com/privacy" style="color: #0066cc;">Privacy Policy</a>.</p>
        
        <p>Need help? Contact our support team at <a href="mailto:support@yourmedicalwebsite.com" style="color: #0066cc;">support@yourmedicalwebsite.com</a>.</p>
        
        <p>To your health,<br>
        The [Your Medical Platform] Team</p>
    </div>
    
    <div class="footer">
        <p>© 2023 [Your Medical Platform]. All rights reserved.</p>
        <p>
            [Your Medical Platform Address] | 
            <a href="https://yourmedicalwebsite.com" style="color: #777;">Website</a> | 
            <a href="https://yourmedicalwebsite.com/unsubscribe" style="color: #777;">Unsubscribe</a>
        </p>
        <p><em>This email was sent to [Patient's Email] as part of your account registration.</em></p>
    </div>
</body>
</html>`





export const preCheckInMailTemplate = `<!DOCTYPE html>


// trey decides 

</html>`

// export const sendEmail = async (to, subject, html) => {
//     const send = await transporter.sendMail({
//         from: process.env.USER_EMAIL,
//         to: to,
//         subject: subject,
//         html:html,
//     });
// };
