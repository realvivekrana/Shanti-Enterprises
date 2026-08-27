// ============================================================
// SHANTI ENTERPRISES
// Upload Controller
// Backend - Product Image Upload
// ============================================================

const streamifier = require("streamifier");

const {
  cloudinary,
  isCloudinaryConfigured,
} = require("../config/cloudinary");

// ============================================================
// UPLOAD PRODUCT IMAGE
// ============================================================

const uploadProductImage = async (
  req,
  res,
  next
) => {
  try {
    // ----------------------------------------------------------
    // CLOUDINARY CHECK
    // ----------------------------------------------------------

    if (
      !isCloudinaryConfigured
    ) {
      const error =
        new Error(
          "Cloudinary is not configured. Please check Backend/.env."
        );

      error.statusCode = 500;

      return next(error);
    }

    // ----------------------------------------------------------
    // FILE CHECK
    // ----------------------------------------------------------

    if (!req.file) {
      const error =
        new Error(
          "Please select an image to upload."
        );

      error.statusCode = 400;

      return next(error);
    }

    // ----------------------------------------------------------
    // CLOUDINARY UPLOAD
    // ----------------------------------------------------------

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder:
            "shanti-enterprises/products",

          resource_type:
            "image",

          transformation: [
            {
              width: 1200,
              height: 1200,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },

        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary upload error:",
              error
            );

            const uploadError =
              new Error(
                "Unable to upload image to Cloudinary."
              );

            uploadError.statusCode = 500;

            return next(
              uploadError
            );
          }

          // ----------------------------------------------------
          // SUCCESS RESPONSE
          // ----------------------------------------------------

          return res.status(200).json({
            success: true,

            message:
              "Image uploaded successfully",

            image: {
              url: result.secure_url,

              publicId:
                result.public_id,

              width:
                result.width,

              height:
                result.height,

              format:
                result.format,
            },
          });
        }
      );

    // ----------------------------------------------------------
    // SEND MEMORY BUFFER TO CLOUDINARY
    // ----------------------------------------------------------

    streamifier
      .createReadStream(
        req.file.buffer
      )
      .pipe(uploadStream);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  uploadProductImage,
};