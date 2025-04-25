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
    <title>Welcome to pVault</title>
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
        <h2>Welcome to pVault!</h2>
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


export const appointmentConfirmationMailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header Section -->
    <header style="text-align: center; padding: 20px 0; background-color: #f0f8ff;">
        <img src="[Your-Logo-URL]" alt="pVault Health Services" style="max-width: 200px; height: auto;">
        <h1 style="color: #2c3e50;">Appointment Confirmation</h1>
    </header>

    <!-- Main Content -->
    <main style="padding: 20px;">
        <p>Dear {{lastName}},</p>
        
        <p>Your appointment has been successfully scheduled through pVault.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #3498db;">
            <h3 style="color: #2c3e50; margin-top: 0;">Appointment Details:</h3>
            <ul style="list-style-type: none; padding: 0;">
                <li><strong>Date:</strong> [Appointment Date]</li>
                <li><strong>Time:</strong> [Appointment Time]</li>
                <li><strong>Location:</strong> [Hospital/Clinic Name]</li>
                <li><strong>Address:</strong> [Full Hospital Address]</li>
                <li><strong>Physician:</strong> Dr. [Doctor's Name]</li>
                <li><strong>Department:</strong> [Department/Specialty]</li>
            </ul>
        </div>

        <h4 style="color: #2c3e50;">Preparation Instructions:</h4>
        <ul>
            <li>Please arrive 15 minutes before your scheduled time</li>
            <li>Bring your insurance card and photo ID</li>
            <li>List of current medications (if any)</li>
        </ul>

        <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h4 style="color: #856404; margin-top: 0;">Important Reminder:</h4>
            <p>Please notify us at least 24 hours in advance if you need to cancel or reschedule your appointment.</p>
        </div>

        <p>For any questions or changes, contact us at:</p>
        <p>
            📞 [Hospital Phone Number]<br>
            ✉ [Hospital Email Address]<br>
            🌐 [Hospital Website URL]
        </p>
        </main>

    <!-- Footer -->
    <footer style="text-align: center; padding: 20px; background-color: #f8f9fa; color: #6c757d; font-size: 0.9em;">
        <p>This is an automated message - please do not reply directly to this email</p>
        <p>[Hospital Name] • [Hospital Address]</p>
        <p>
            <a href="[Privacy Policy URL]" style="color: #3498db; text-decoration: none;">Privacy Policy</a> | 
            <a href="[Contact URL]" style="color: #3498db; text-decoration: none;">Contact Us</a>
        </p>
        <p>© 2023 [Hospital Name]. All rights reserved.</p>
    </footer>

</body>
</html>`





export const preCheckInMailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pre-Check-In for Your Upcoming Appointment</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    
    <!-- Header Section -->
    <header style="text-align: center; padding: 20px 0;">
        <img src="[Your-Logo-URL]" alt="pVault Health Services" style="max-width: 200px; height: auto;">
        <h1 style="color: #2c3e50; margin-bottom: 5px;">Complete Your Pre-Check-In</h1>
        <p style="color: #7f8c8d; font-size: 1.1em;">Help us prepare for your visit</p>
    </header>

    <!-- Main Content -->
    <main style="padding: 20px 0;">
        <p>Dear [Patient Name],</p>
        
        <p>We look forward to seeing you for your upcoming appointment on <strong>[Appointment Date] at [Appointment Time]</strong> with <strong>Dr. [Doctor's Name]</strong>.</p>
        
        <div style="text-align: center; margin: 25px 0;">
            <a href="[Pre-Check-In-Link]" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Complete Pre-Check-In Now</a>
            <p style="font-size: 0.8em; color: #7f8c8d; margin-top: 8px;">Link expires in 24 hours</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">What You Can Do Now:</h3>
            <ul style="padding-left: 20px;">
                <li>Verify your personal information</li>
                <li>Update insurance details</li>
                <li>Complete medical history forms</li>
                <li>Sign consent forms electronically</li>
                <li>Review appointment details</li>
            </ul>
        </div>

        <h4 style="color: #2c3e50;">Benefits of Pre-Check-In:</h4>
        <ul style="padding-left: 20px;">
            <li><strong>Save time</strong> - Reduce your wait at the facility</li>
            <li><strong>Minimize contact</strong> - Less paperwork at the office</li>
            <li><strong>Ensure accuracy</strong> - Review your information carefully</li>
        </ul>

        <div style="background-color: #e8f4fc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #2c3e50; margin-top: 0;">Need Help?</h4>
            <p>If you experience any issues with pre-check-in, please contact our office at:</p>
            <p style="margin: 10px 0;">
                📞 <a href="tel:[Hospital-Phone]" style="color: #3498db; text-decoration: none;">[Hospital Phone Number]</a><br>
                ✉ <a href="mailto:[Hospital-Email]" style="color: #3498db; text-decoration: none;">[Hospital Email Address]</a>
            </p>
            <p>Our staff is available [Office Hours].</p>
        </div>
    </main>

    <!-- Appointment Reminder -->
    <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 15px 0; margin: 15px 0;">
        <h4 style="color: #2c3e50; margin-top: 0;">Appointment Reminder</h4>
        <p><strong>When:</strong> [Appointment Date] at [Appointment Time]</p>
        <p><strong>Where:</strong> [Hospital/Clinic Name]<br>
        [Hospital Address]</p>
        <p><a href="[Map-Link]" style="color: #3498db; text-decoration: none;">📍 Get Directions</a></p>
    </div>

    <!-- Footer -->
    <footer style="text-align: center; padding: 20px 0; color: #7f8c8d; font-size: 0.9em;">
        <p>Please complete your pre-check-in at least 24 hours before your appointment.</p>
        <p>This is an automated message - please do not reply directly to this email</p>
        <p>
            <a href="[Privacy-Policy-URL]" style="color: #3498db; text-decoration: none;">Privacy Policy</a> | 
            <a href="[Terms-URL]" style="color: #3498db; text-decoration: none;">Terms of Service</a> | 
            <a href="[Contact-URL]" style="color: #3498db; text-decoration: none;">Contact Us</a>
        </p>
        <p>© 2023 pVault. All rights reserved.</p>
    </footer>

</body>
</html>`

// export const sendEmail = async (to, subject, html) => {
//     const send = await transporter.sendMail({
//         from: process.env.USER_EMAIL,
//         to: to,
//         subject: subject,
//         html:html,
//     });
// };
