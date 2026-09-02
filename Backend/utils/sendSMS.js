// ============================================================
// SHANTI ENTERPRISES
// SMS Utility — Stub
// Backend - SMS Notifications
// ============================================================
//
// NOTE: SMS integration is not yet configured.
// To enable SMS, integrate a provider such as Twilio or MSG91:
//
//   Twilio:   npm install twilio
//   MSG91:    npm install msg91
//
// Then replace the stub below with real provider code and add
// the required credentials to your .env file.
// ============================================================

// ============================================================
// SEND SMS
// ============================================================

const sendSMS = async ({
  to,
  message,
}) => {
  if (!to) {
    throw new Error(
      "Recipient phone number is required"
    );
  }

  if (!message) {
    throw new Error(
      "SMS message body is required"
    );
  }

  // ----------------------------------------------------------
  // SMS provider not configured — log and return gracefully.
  // Remove this block and add real provider code when ready.
  // ----------------------------------------------------------

  console.warn(
    `[SMS] Provider not configured. SMS to ${to} was NOT sent.`
  );

  return {
    success: false,
    message: "SMS provider is not configured.",
    to,
  };
};

// ============================================================
// SEND ORDER SMS
// ============================================================

const sendOrderSMS = async ({
  to,
  orderNumber,
  customerName,
  status = "confirmed",
}) => {
  const message =
    `Hi ${customerName || "Customer"}, your order #${orderNumber} has been ${status}. Thank you for choosing Shanti Enterprises!`;

  return sendSMS({ to, message });
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  sendSMS,
  sendOrderSMS,
};
