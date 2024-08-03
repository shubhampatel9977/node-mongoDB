const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider here (e.g., 'Gmail', 'Yahoo', 'Outlook')
  auth: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL_USER,
      to, // List of recipients
      subject, // Subject line
      text, // Plain text body
      html // HTML body
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;


// how to use in function

// await sendEmail('shubham.mactosys12@gmail.com', 'Otp', '', sendOtptemplate(123456));