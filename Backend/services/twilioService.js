const twilio =
  require('twilio');


// ======================================================
// TWILIO CONFIGURATION
// ======================================================

const accountSid =
  process.env.TWILIO_ACCOUNT_SID;

const authToken =
  process.env.TWILIO_AUTH_TOKEN;

const phoneNumber =
  process.env.TWILIO_PHONE_NUMBER;

const whatsappFrom =
  process.env.TWILIO_WHATSAPP_FROM;


// ======================================================
// TWILIO CLIENT
// ======================================================

let client = null;


if (
  accountSid &&
  authToken
) {

  client =
    twilio(
      accountSid,
      authToken
    );

}


// ======================================================
// CHECK CONFIGURATION
// ======================================================

const isTwilioConfigured =
  () => {

    return Boolean(

      accountSid &&
      authToken

    );

  };


// ======================================================
// NORMALIZE PHONE NUMBER
// ======================================================

const normalizePhoneNumber =
  (phone) => {

    if (
      !phone
    ) {

      return null;

    }


    let value =
      String(
        phone
      ).trim();


    // Remove spaces

    value =
      value.replace(
        /\s+/g,
        ''
      );


    // Remove brackets

    value =
      value.replace(
        /[()]/g,
        ''
      );


    // Convert Indian
    // 10 digit number
    // to +91 format

    if (
      /^[6-9]\d{9}$/.test(
        value
      )
    ) {

      value =
        `+91${value}`;

    }


    // Convert 91XXXXXXXXXX

    if (
      /^91\d{10}$/.test(
        value
      )
    ) {

      value =
        `+${value}`;

    }


    // Final E.164 style check

    if (
      !/^\+\d{8,15}$/.test(
        value
      )
    ) {

      return null;

    }


    return value;

  };


// ======================================================
// SEND SMS
// ======================================================

const sendSMS =
  async ({
    to,
    body,
  }) => {

    if (
      !isTwilioConfigured()
    ) {

      console.warn(
        'Twilio is not configured. SMS skipped.'
      );

      return null;

    }


    if (
      !phoneNumber
    ) {

      console.warn(
        'TWILIO_PHONE_NUMBER is missing. SMS skipped.'
      );

      return null;

    }


    const normalizedPhone =
      normalizePhoneNumber(
        to
      );


    if (
      !normalizedPhone
    ) {

      console.warn(
        `Invalid phone number: ${to}`
      );

      return null;

    }


    if (
      !body
    ) {

      console.warn(
        'SMS body is empty.'
      );

      return null;

    }


    try {

      const message =
        await client.messages.create({

          body,

          from:
            phoneNumber,

          to:
            normalizedPhone,

        });


      console.log(
        `SMS sent successfully: ${message.sid}`
      );


      return message;

    } catch (error) {

      console.error(
        'Twilio SMS error:',
        error.message
      );


      throw error;

    }

  };


// ======================================================
// SEND WHATSAPP
// ======================================================

const sendWhatsApp =
  async ({
    to,
    body,
  }) => {

    if (
      !isTwilioConfigured()
    ) {

      console.warn(
        'Twilio is not configured. WhatsApp skipped.'
      );

      return null;

    }


    if (
      !whatsappFrom
    ) {

      console.warn(
        'TWILIO_WHATSAPP_FROM is missing. WhatsApp skipped.'
      );

      return null;

    }


    const normalizedPhone =
      normalizePhoneNumber(
        to
      );


    if (
      !normalizedPhone
    ) {

      console.warn(
        `Invalid WhatsApp number: ${to}`
      );

      return null;

    }


    if (
      !body
    ) {

      console.warn(
        'WhatsApp body is empty.'
      );

      return null;

    }


    try {

      const message =
        await client.messages.create({

          body,

          from:
            whatsappFrom,

          to:
            `whatsapp:${normalizedPhone}`,

        });


      console.log(
        `WhatsApp sent successfully: ${message.sid}`
      );


      return message;

    } catch (error) {

      console.error(
        'Twilio WhatsApp error:',
        error.message
      );


      throw error;

    }

  };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  sendSMS,

  sendWhatsApp,

  normalizePhoneNumber,

  isTwilioConfigured,

};