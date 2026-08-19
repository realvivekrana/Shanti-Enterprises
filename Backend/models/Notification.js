const mongoose = require('mongoose');


// ======================================================
// NOTIFICATION SCHEMA
// ======================================================

const notificationSchema = new mongoose.Schema(
  {

    // ==================================================
    // CUSTOMER / USER
    // ==================================================

    user: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        'User',

      required:
        true,

      index:
        true,

    },


    // ==================================================
    // NOTIFICATION TYPE
    // ==================================================

    type: {

      type:
        String,

      enum: [

        'order_confirmation',

        'payment_confirmation',

        'shipment_update',

        'delivery_update',

        'return_update',

        'refund_update',

        'general',

      ],

      required:
        true,

    },


    // ==================================================
    // TITLE
    // ==================================================

    title: {

      type:
        String,

      required:
        true,

      trim:
        true,

      maxlength:
        200,

    },


    // ==================================================
    // MESSAGE
    // ==================================================

    message: {

      type:
        String,

      required:
        true,

      trim:
        true,

      maxlength:
        1000,

    },


    // ==================================================
    // RELATED ORDER
    // ==================================================

    order: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        'Order',

      default:
        null,

    },


    // ==================================================
    // RELATED RETURN
    // ==================================================

    returnRequest: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        'ReturnRequest',

      default:
        null,

    },


    // ==================================================
    // READ STATUS
    // ==================================================

    read: {

      type:
        Boolean,

      default:
        false,

      index:
        true,

    },


    // ==================================================
    // READ DATE
    // ==================================================

    readAt: {

      type:
        Date,

      default:
        null,

    },


    // ==================================================
    // CHANNEL STATUS
    // ==================================================

    channels: {

      website: {

        sent: {

          type:
            Boolean,

          default:
            true,

        },

        sentAt: {

          type:
            Date,

          default:
            Date.now,

        },

      },


      email: {

        enabled: {

          type:
            Boolean,

          default:
            false,

        },

        sent: {

          type:
            Boolean,

          default:
            false,

        },

        sentAt: {

          type:
            Date,

          default:
            null,

        },

        error: {

          type:
            String,

          default:
            null,

        },

      },


      sms: {

        enabled: {

          type:
            Boolean,

          default:
            false,

        },

        sent: {

          type:
            Boolean,

          default:
            false,

        },

        sentAt: {

          type:
            Date,

          default:
            null,

        },

        error: {

          type:
            String,

          default:
            null,

        },

      },


      whatsapp: {

        enabled: {

          type:
            Boolean,

          default:
            false,

        },

        sent: {

          type:
            Boolean,

          default:
            false,

        },

        sentAt: {

          type:
            Date,

          default:
            null,

        },

        error: {

          type:
            String,

          default:
            null,

        },

      },

    },

  },

  {

    timestamps:
      true,

  }

);


// ======================================================
// INDEXES
// ======================================================

notificationSchema.index({

  user:
    1,

  createdAt:
    -1,

});


notificationSchema.index({

  user:
    1,

  read:
    1,

  createdAt:
    -1,

});


notificationSchema.index({

  order:
    1,

});


module.exports =
  mongoose.model(
    'Notification',
    notificationSchema
  );