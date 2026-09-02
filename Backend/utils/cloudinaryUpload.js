// ============================================================
// SHANTI ENTERPRISES
// Cloudinary Upload Utility
// Backend - Product Image Upload
// ============================================================

const { cloudinary } = require("../config/cloudinary");

// ============================================================
// UPLOAD BUFFER TO CLOUDINARY
// ============================================================

const uploadToCloudinary = (
  buffer,
  options = {}
) => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              options.folder ||
              "shanti-enterprises/products",

            resource_type:
              options.resourceType ||
              "image",

            ...options,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result);
          }
        );

      uploadStream.end(buffer);
    }
  );
};

// ============================================================
// DELETE IMAGE FROM CLOUDINARY
// ============================================================

const deleteFromCloudinary = async (
  publicId
) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
    }
  );
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};