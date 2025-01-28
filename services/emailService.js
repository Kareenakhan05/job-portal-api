import nodemailer from 'nodemailer';

export default async function send_email(to, subject, text) {
    // Ensure necessary environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        const errorMessage = 'ERROR: Missing EMAIL_USER or EMAIL_PASS in environment variables';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email message options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (err) {
        // Log error details
        const errorMessage = `ERROR: Failed to send email. Error: ${err.message}`;
        console.error(errorMessage);
        throw new Error('Failed to send email. Please try again later.');
    }
}
