// ============================================================
// SHANTI ENTERPRISES
// Email Utility
// Backend - Email Notifications
// ============================================================

const nodemailer = require("nodemailer");

// ============================================================
// CREATE TRANSPORTER
// ============================================================

const createTransporter = () => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_PORT ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD
  ) {
    throw new Error(
      "Email configuration is missing. Please configure EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASSWORD."
    );
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,

    port: Number(
      process.env.EMAIL_PORT
    ),

    secure:
      String(
        process.env.EMAIL_SECURE
      ).toLowerCase() === "true",

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASSWORD,
    },
  });
};

// ============================================================
// SEND EMAIL
// ============================================================

const sendEmail = async ({
  to,
  subject,
  text = "",
  html = "",
  attachments = [],
}) => {
  if (!to) {
    throw new Error(
      "Recipient email address is required"
    );
  }

  if (!subject) {
    throw new Error(
      "Email subject is required"
    );
  }

  const transporter =
    createTransporter();

  const mailOptions = {
    from:
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER,

    to,

    subject,

    text,

    html,

    attachments,
  };

  return transporter.sendMail(
    mailOptions
  );
};

// ============================================================
// SEND ORDER EMAIL
// ============================================================

const sendOrderEmail = async ({
  to,
  orderNumber,
  customerName,
  totalAmount,
  status = "confirmed",
}) => {
  const subject =
    `Order ${orderNumber} - Shanti Enterprises`;

  const text = `
Hello ${customerName || "Customer"},

Your order ${orderNumber} has been ${status}.

Order Amount: ₹${Number(
    totalAmount || 0
  ).toFixed(2)}

Thank you for choosing Shanti Enterprises.

Regards,
Shanti Enterprises
`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Shanti Enterprises</h2>

      <p>
        Hello ${customerName || "Customer"},
      </p>

      <p>
        Your order
        <strong>${orderNumber}</strong>
        has been <strong>${status}</strong>.
      </p>

      <p>
        <strong>Order Amount:</strong>
        ₹${Number(
          totalAmount || 0
        ).toFixed(2)}
      </p>

      <p>
        Thank you for choosing
        <strong>Shanti Enterprises</strong>.
      </p>

      <p>
        Regards,<br />
        Shanti Enterprises
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  sendEmail,
  sendOrderEmail,
};