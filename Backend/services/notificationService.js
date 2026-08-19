const Notification =
  require('../models/Notification');

const User =
  require('../models/User');

const sendEmail =
  require('../utils/sendEmail');


// ======================================================
// DEFAULT CHANNEL SETTINGS
// ======================================================

const defaultChannels = {

  website:
    true,

  email:
    true,

  sms:
    false,

  whatsapp:
    false,

};


// ======================================================
// NOTIFICATION TEMPLATES
// ======================================================

const notificationTemplates = {

  order_confirmation: {

    title:
      'Order Confirmed',

    message:
      'Your order has been confirmed successfully.',

  },


  payment_confirmation: {

    title:
      'Payment Confirmed',

    message:
      'Your payment has been received successfully.',

  },


  shipment_update: {

    title:
      'Shipment Update',

    message:
      'Your order shipment has been updated.',

  },


  delivery_update: {

    title:
      'Delivery Update',

    message:
      'There is an update regarding your delivery.',

  },


  return_update: {

    title:
      'Return Update',

    message:
      'There is an update regarding your return request.',

  },


  refund_update: {

    title:
      'Refund Update',

    message:
      'There is an update regarding your refund.',

  },


  general: {

    title:
      'Notification',

    message:
      'You have a new notification.',

  },

};


// ======================================================
// CREATE NOTIFICATION
// ======================================================

const createNotification =
  async ({

    userId,

    type,

    title,

    message,

    orderId = null,

    returnRequestId = null,

    channels = {},

  }) => {

    try {

      // ==================================================
      // VALIDATION
      // ==================================================

      if (!userId) {

        throw new Error(
          'User ID is required for notification'
        );

      }


      if (!type) {

        throw new Error(
          'Notification type is required'
        );

      }


      // ==================================================
      // GET USER
      // ==================================================

      const user =
        await User.findById(
          userId
        );


      if (!user) {

        throw new Error(
          'User not found'
        );

      }


      // ==================================================
      // TEMPLATE
      // ==================================================

      const template =
        notificationTemplates[
          type
        ] ||
        notificationTemplates.general;


      const notificationTitle =
        title ||
        template.title;


      const notificationMessage =
        message ||
        template.message;


      // ==================================================
      // CHANNEL CONFIG
      // ==================================================

      const finalChannels = {

        website:
          channels.website ??
          defaultChannels.website,

        email:
          channels.email ??
          defaultChannels.email,

        sms:
          channels.sms ??
          defaultChannels.sms,

        whatsapp:
          channels.whatsapp ??
          defaultChannels.whatsapp,

      };


      // ==================================================
      // CREATE WEBSITE NOTIFICATION
      // ==================================================

      const notification =
        await Notification.create({

          user:
            userId,

          type,

          title:
            notificationTitle,

          message:
            notificationMessage,

          order:
            orderId,

          returnRequest:
            returnRequestId,

          channels: {

            website: {

              sent:
                true,

              sentAt:
                new Date(),

            },

            email: {

              enabled:
                finalChannels.email,

            },

            sms: {

              enabled:
                finalChannels.sms,

            },

            whatsapp: {

              enabled:
                finalChannels.whatsapp,

            },

          },

        });


      // ==================================================
      // EMAIL
      // ==================================================

      if (
        finalChannels.email &&
        user.email
      ) {

        try {

          await sendEmail({

            to:
              user.email,

            subject:
              notificationTitle,

            html: `

              <div
                style="
                  font-family: Arial, sans-serif;
                  max-width: 600px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #e5e7eb;
                  border-radius: 12px;
                "
              >

                <h2
                  style="
                    color: #0f766e;
                    margin-bottom: 20px;
                  "
                >
                  ${notificationTitle}
                </h2>

                <p
                  style="
                    color: #374151;
                    font-size: 16px;
                    line-height: 1.6;
                  "
                >
                  ${notificationMessage}
                </p>

                <p
                  style="
                    color: #6b7280;
                    font-size: 13px;
                    margin-top: 30px;
                  "
                >
                  Shanti Enterprises
                </p>

              </div>

            `,

          });


          notification.channels.email.sent =
            true;

          notification.channels.email.sentAt =
            new Date();

          notification.channels.email.error =
            null;


        } catch (error) {

          notification.channels.email.sent =
            false;

          notification.channels.email.error =
            error.message;

          console.error(
            'Notification email failed:',
            error.message
          );

        }

      }


      // ==================================================
      // SMS
      // ==================================================
      //
      // Provider integration intentionally disabled
      // until SMS provider credentials are configured.
      //

      if (
        finalChannels.sms
      ) {

        notification.channels.sms.sent =
          false;

        notification.channels.sms.error =
          'SMS provider is not configured yet.';

      }


      // ==================================================
      // WHATSAPP
      // ==================================================
      //
      // Meta WhatsApp / Twilio integration will be
      // connected after provider credentials are added.
      //

      if (
        finalChannels.whatsapp
      ) {

        notification.channels.whatsapp.sent =
          false;

        notification.channels.whatsapp.error =
          'WhatsApp provider is not configured yet.';

      }


      await notification.save();


      return notification;

    } catch (error) {

      console.error(
        'Notification creation failed:',
        error.message
      );


      // Notification failure should NOT break
      // the main order/payment operation.

      return null;

    }

  };


// ======================================================
// ORDER CONFIRMATION
// ======================================================

const sendOrderConfirmation =
  async ({
    userId,
    orderId,
    orderNumber,
  }) => {

    return createNotification({

      userId,

      type:
        'order_confirmation',

      title:
        'Order Confirmed',

      message:
        `Your order ${
          orderNumber ||
          orderId
        } has been confirmed successfully.`,

      orderId,

      channels: {

        website:
          true,

        email:
          true,

        sms:
          false,

        whatsapp:
          false,

      },

    });

  };


// ======================================================
// PAYMENT CONFIRMATION
// ======================================================

const sendPaymentConfirmation =
  async ({
    userId,
    orderId,
    amount,
  }) => {

    return createNotification({

      userId,

      type:
        'payment_confirmation',

      title:
        'Payment Confirmed',

      message:
        `Your payment of ₹${
          amount
        } has been received successfully.`,

      orderId,

      channels: {

        website:
          true,

        email:
          true,

        sms:
          false,

        whatsapp:
          false,

      },

    });

  };


// ======================================================
// SHIPMENT UPDATE
// ======================================================

const sendShipmentUpdate =
  async ({
    userId,
    orderId,
    status,
    trackingId,
  }) => {

    return createNotification({

      userId,

      type:
        'shipment_update',

      title:
        'Shipment Update',

      message:
        `Your shipment status is now "${
          status
        }"${
          trackingId
            ? ` (Tracking ID: ${trackingId})`
            : ''
        }.`,

      orderId,

      channels: {

        website:
          true,

        email:
          true,

        sms:
          false,

        whatsapp:
          false,

      },

    });

  };


// ======================================================
// DELIVERY UPDATE
// ======================================================

const sendDeliveryUpdate =
  async ({
    userId,
    orderId,
    status,
  }) => {

    return createNotification({

      userId,

      type:
        'delivery_update',

      title:
        'Delivery Update',

      message:
        `Your order delivery status is now "${
          status
        }".`,

      orderId,

      channels: {

        website:
          true,

        email:
          true,

        sms:
          false,

        whatsapp:
          false,

      },

    });

  };


// ======================================================
// RETURN UPDATE
// ======================================================

const sendReturnUpdate =
  async ({
    userId,
    orderId,
    returnRequestId,
    status,
  }) => {

    return createNotification({

      userId,

      type:
        'return_update',

      title:
        'Return Update',

      message:
        `Your return request status is now "${
          status
        }".`,

      orderId,

      returnRequestId,

      channels: {

        website:
          true,

        email:
          true,

        sms:
          false,

        whatsapp:
          false,

      },

    });

  };


// ======================================================
// REFUND UPDATE
// ======================================================

const sendRefundUpdate =
  async ({
    userId,
    orderId,
    amount,
    status,
  }) => {

    return createNotification({

      userId,

      type:
        'refund_update',

      title:
        'Refund Update',

      message:
        `Your refund of ₹${
          amount
        } is "${
          status
        }".`,

      orderId,

      channels: {

        website:
          true,

        email:
          true,

        sms:
          false,

        whatsapp:
          false,

      },

    });

  };


module.exports = {

  createNotification,

  sendOrderConfirmation,

  sendPaymentConfirmation,

  sendShipmentUpdate,

  sendDeliveryUpdate,

  sendReturnUpdate,

  sendRefundUpdate,

};