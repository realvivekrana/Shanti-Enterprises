const mongoose = require('mongoose');


// ======================================================
// ORDER SCHEMA
// ======================================================

const orderSchema = new mongoose.Schema(
  {
    // ====================================================
    // CUSTOMER
    // ====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },


    // ====================================================
    // ORDER ITEMS
    // ====================================================

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },


        // ==================================================
        // SUPPLIER
        // ==================================================

        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },


        name: {
          type: String,
          default: '',
        },


        quantity: {
          type: Number,
          required: true,
          min: 1,
        },


        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],


    // ====================================================
    // SHIPPING ADDRESS
    // ====================================================

    shippingAddress: {
      street: {
        type: String,
        required: true,
      },


      city: {
        type: String,
        required: true,
      },


      state: {
        type: String,
        required: true,
      },


      pincode: {
        type: String,
        required: true,
      },


      phone: {
        type: String,
        required: true,
      },
    },


    // ====================================================
    // PAYMENT
    // ====================================================

    paymentMethod: {
      type: String,
      required: true,

      enum: [
        'Razorpay',
        'COD',
        'Credit',
        'Partial',
      ],
    },


    paymentResult: {
      id: {
        type: String,
        default: '',
      },


      status: {
        type: String,
        default: '',
      },


      updateTime: {
        type: String,
        default: '',
      },
    },


    // ====================================================
    // PRICE
    // ====================================================

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },


    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },


    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },


    // ====================================================
    // PAYMENT STATUS
    // ====================================================

    isPaid: {
      type: Boolean,
      default: false,
    },


    paidAt: {
      type: Date,
    },


    // ====================================================
    // ORDER STATUS
    // ====================================================

    orderStatus: {
      type: String,

      enum: [
        'Placed',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],

      default: 'Placed',
    },


    // ====================================================
    // SHIPPING
    // ====================================================

    shipment: {

      // ==================================================
      // CARRIER
      // ==================================================

      carrier: {
        type: String,
        default: '',
      },


      // ==================================================
      // MAIN TRACKING
      // ==================================================

      trackingId: {
        type: String,
        default: '',
      },


      trackingUrl: {
        type: String,
        default: '',
      },


      // ==================================================
      // SHIPMENT STATUS
      // ==================================================

      status: {
        type: String,
        default: 'Processing',
      },


      // ==================================================
      // ESTIMATED DELIVERY
      // ==================================================

      estimatedDelivery: {
        type: Date,
      },


      // ==================================================
      // TOTAL SHIPPING WEIGHT
      // ==================================================

      totalWeight: {
        type: Number,
        default: 0,
        min: 0,
      },


      weightUnit: {
        type: String,

        enum: [
          'kg',
          'g',
        ],

        default: 'kg',
      },


      // ==================================================
      // SHIPPING CHARGES
      // ==================================================

      shippingCharges: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ==================================================
      // PARTIAL SHIPMENT
      // ==================================================

      isPartialShipment: {
        type: Boolean,
        default: false,
      },


      // ==================================================
      // SHIPROCKET
      // ==================================================

      shiprocket: {

        // ================================================
        // SHIPROCKET ORDER ID
        // ================================================

        orderId: {
          type: String,
          default: '',
        },


        // ================================================
        // SHIPROCKET SHIPMENT ID
        // ================================================

        shipmentId: {
          type: String,
          default: '',
        },


        // ================================================
        // AWB
        // ================================================

        awbCode: {
          type: String,
          default: '',
        },


        // ================================================
        // COURIER ID
        // ================================================

        courierId: {
          type: String,
          default: '',
        },


        // ================================================
        // COURIER NAME
        // ================================================

        courierName: {
          type: String,
          default: '',
        },


        // ================================================
        // SHIPROCKET STATUS
        // ================================================

        status: {
          type: String,
          default: '',
        },


        // ================================================
        // SHIPPING LABEL
        // ================================================

        labelUrl: {
          type: String,
          default: '',
        },


        // ================================================
        // INVOICE
        // ================================================

        invoiceUrl: {
          type: String,
          default: '',
        },


        // ================================================
        // PICKUP
        // ================================================

        pickupScheduled: {
          type: Boolean,
          default: false,
        },


        pickupScheduledAt: {
          type: Date,
        },


        // ================================================
        // LAST SYNC
        // ================================================

        lastSyncedAt: {
          type: Date,
        },


        // ================================================
        // LAST API RESPONSE
        // ================================================

        lastResponse: {
          type: mongoose.Schema.Types.Mixed,
          default: null,
        },

      },


      // ==================================================
      // PACKAGES
      // ==================================================

      packages: [

        {

          packageId: {
            type: String,
            required: true,
          },


          packageNumber: {
            type: Number,
            required: true,
          },


          // ================================================
          // PACKAGE ITEMS
          // ================================================

          items: [

            {

              product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
              },


              name: {
                type: String,
                default: '',
              },


              quantity: {
                type: Number,
                required: true,
                min: 1,
              },

            },

          ],


          // ================================================
          // PACKAGE WEIGHT
          // ================================================

          weight: {
            type: Number,
            default: 0,
            min: 0,
          },


          weightUnit: {
            type: String,

            enum: [
              'kg',
              'g',
            ],

            default: 'kg',
          },


          // ================================================
          // PACKAGE DIMENSIONS
          // ================================================

          dimensions: {

            length: {
              type: Number,
              default: 0,
              min: 0,
            },


            width: {
              type: Number,
              default: 0,
              min: 0,
            },


            height: {
              type: Number,
              default: 0,
              min: 0,
            },


            unit: {
              type: String,

              enum: [
                'cm',
                'inch',
              ],

              default: 'cm',
            },

          },


          // ================================================
          // PACKAGE SHIPPING CHARGE
          // ================================================

          shippingCharge: {
            type: Number,
            default: 0,
            min: 0,
          },


          // ================================================
          // PACKAGE CARRIER
          // ================================================

          carrier: {
            type: String,
            default: '',
          },


          // ================================================
          // PACKAGE TRACKING
          // ================================================

          trackingId: {
            type: String,
            default: '',
          },


          trackingUrl: {
            type: String,
            default: '',
          },


          // ================================================
          // PACKAGE STATUS
          // ================================================

          status: {
            type: String,

            enum: [
              'Processing',
              'Packed',
              'Shipped',
              'Out for Delivery',
              'Delivered',
            ],

            default: 'Processing',
          },


          estimatedDelivery: {
            type: Date,
          },


          // ================================================
          // PACKAGE STATUS HISTORY
          // ================================================

          statusHistory: [

            {

              status: {
                type: String,
                required: true,
              },


              note: {
                type: String,
                default: '',
              },


              timestamp: {
                type: Date,
                default: Date.now,
              },

            },

          ],

        },

      ],


      // ==================================================
      // ORDER STATUS HISTORY
      // ==================================================

      statusHistory: [

        {

          status: {
            type: String,
            required: true,
          },


          note: {
            type: String,
            default: '',
          },


          timestamp: {
            type: Date,
            default: Date.now,
          },

        },

      ],

    },

  },


  // ====================================================
  // TIMESTAMPS
  // ====================================================

  {
    timestamps: true,
  }

);


// ======================================================
// MODEL
// ======================================================

module.exports =
  mongoose.model(
    'Order',
    orderSchema
  );