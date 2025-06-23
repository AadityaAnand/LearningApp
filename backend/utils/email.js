const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // If email is not configured, log the email instead
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured. Would send:');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('HTML:', html);
      return { success: true, message: 'Email logged (not configured)' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Micro Learning Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail }; 