// ============================================================
// SHANTI ENTERPRISES
// Upload Controller
// Phase 6 - Admin Product Images
// ============================================================

const cloudinary = require("cloudinary").v2;

// ============================================================
// CLOUDINARY CONFIGURATION
// ============================================================

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

// ============================================================
// UPLOAD IMAGE
// ============================================================

const uploadImage = async (
  req,
  res,
  next
) => {
  try {
    // ----------------------------------------------------------
    // CHECK FILE
    // ----------------------------------------------------------

    if (!req.file) {
      const error = new Error(
        "Please choose an image to upload."
      );

      error.statusCode = 400;

      return next(error);
    }

    // ----------------------------------------------------------
    // CLOUDINARY CONFIG CHECK
    // ----------------------------------------------------------

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      const error = new Error(
        "Cloudinary configuration is missing."
      );

      error.statusCode = 500;

      return next(error);
    }

    // ----------------------------------------------------------
    // UPLOAD BUFFER TO CLOUDINARY
    // ----------------------------------------------------------

    const uploadFromBuffer = () => {
      return new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "shanti-enterprises/products",

                resource_type:
                  "image",
              },

              (
                uploadError,
                result
              ) => {
                if (uploadError) {
                  return reject(
                    uploadError
                  );
                }

                resolve(result);
              }
            );

          uploadStream.end(
            req.file.buffer
          );
        }
      );
    };

    // ----------------------------------------------------------
    // UPLOAD
    // ----------------------------------------------------------

    const result =
      await uploadFromBuffer();

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

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

        resourceType:
          result.resource_type,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  uploadImage,
};