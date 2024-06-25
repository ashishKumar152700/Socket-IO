import nodemailer from 'nodemailer';
import Email from '../models/email.model.js';

// Function to handle sending emails
const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;

    // Save the email to the database
    const email = new Email({ to, subject, text });

    try {
        await email.save();

        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Set up email data
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        };

        // Send mail
        let info = await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent', info: info });
    } catch (error) {
        res.status(500).send({ message: 'Error sending email', error: error });
    }
};

export { sendEmail };
