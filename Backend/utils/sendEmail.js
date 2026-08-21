const transporter = require('../config/email');


// ======================================================
// SEND EMAIL
// ======================================================

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!to) {
      throw new Error(
        'Recipient email is required'
      );
    }

    if (!subject) {
      throw new Error(
        'Email subject is required'
      );
    }

    if (!html) {
      throw new Error(
        'HTML email content is required'
      );
    }


    // --------------------------------------------------
    // PLAIN TEXT FALLBACK
    // --------------------------------------------------

    const fallbackText =
      text ||
      'Thank you for choosing Shanti Enterprises.';


    // --------------------------------------------------
    // SENDER EMAIL
    // --------------------------------------------------

    const senderEmail =
      process.env.EMAIL_USER;


    if (!senderEmail) {
      throw new Error(
        'EMAIL_USER is not configured in .env'
      );
    }


    // --------------------------------------------------
    // SEND EMAIL
    // --------------------------------------------------

    const info =
      await transporter.sendMail({

        from:
          `"Shanti Enterprises" <${senderEmail}>`,

        to,

        subject,

        text:
          fallbackText,

        html,

        replyTo:
          senderEmail,

      });


    // --------------------------------------------------
    // SUCCESS LOG
    // --------------------------------------------------

    console.log(
      `Email sent successfully to ${to}`
    );

    console.log(
      `Message ID: ${info.messageId}`
    );


    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {

    // --------------------------------------------------
    // EMAIL ERROR
    // --------------------------------------------------

    console.error(
      'Email sending failed:',
      error.message
    );


    return {
      success: false,
      error: error.message,
    };
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = sendEmail;
