// mailService.js
const nodemailer = require('nodemailer');
const crd = require('../Config/credentials');

const mailService = {
  sendMail: async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use TLS
      auth: {
        user: crd.user1,
        pass: crd.pass1,
      },
      tls: {
        rejectUnauthorized: false // Add this line to handle self-signed certificates
      },
      logger: true,
      debug: true, // Enable debug logging
    });

    try {
      await transporter.sendMail({
        from: crd.user1,
        to: email,
        subject: subject,
        html: message,
      });
      console.log(`Email sent to ${email}`);
      return true;
    } catch (err) {
      console.error(`Error sending email: ${err}`);
      throw err;
    }
  },

  // Function to generate a registration confirmation message
  getConfirmationMessage: () => {
    return `<p>Thank you for registering for the event! We look forward to seeing you there.</p>`;
  },
};


module.exports = mailService;