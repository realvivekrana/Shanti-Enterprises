const nodemailer = require('nodemailer');


// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});


// ======================================================
// VERIFY EMAIL CONFIGURATION
// ======================================================

transporter.verify((error, success) => {
  if (error) {
    console.error(
      'Email transporter configuration failed:',
      error.message
    );
  } else {
    console.log(
      'Email transporter is ready to send emails.'
    );
  }
});


// ======================================================
// EXPORT
// ======================================================

module.exports = transporter;
