// ============================================================
// SHANTI ENTERPRISES
// Image Upload API
// Frontend Phase 6 - Admin Product Images
// ============================================================

import api from "./axios";

// ============================================================
// UPLOAD IMAGE
// ============================================================

export const uploadImage = async (
  imageFile
) => {
  // ----------------------------------------------------------
  // CHECK FILE
  // ----------------------------------------------------------

  if (!imageFile) {
    throw new Error(
      "Please choose an image."
    );
  }

  // ----------------------------------------------------------
  // CHECK FILE TYPE
  // ----------------------------------------------------------

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (
    !allowedTypes.includes(
      imageFile.type
    )
  ) {
    throw new Error(
      "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
    );
  }

  // ----------------------------------------------------------
  // CHECK FILE SIZE
  // ----------------------------------------------------------

  const maxSize =
    5 * 1024 * 1024;

  if (
    imageFile.size >
    maxSize
  ) {
    throw new Error(
      "Image size cannot exceed 5 MB."
    );
  }

  // ----------------------------------------------------------
  // FORM DATA
  // ----------------------------------------------------------

  const formData =
    new FormData();

  formData.append(
    "image",
    imageFile
  );

  // ----------------------------------------------------------
  // API REQUEST
  // ----------------------------------------------------------

  const response =
    await api.post(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },

        timeout: 60000,
      }
    );

  // ----------------------------------------------------------
  // CHECK RESPONSE
  // ----------------------------------------------------------

  if (
    !response.data?.success
  ) {
    throw new Error(
      response.data?.message ||
        "Image upload failed."
    );
  }

  // ----------------------------------------------------------
  // RETURN UPLOADED IMAGE
  // ----------------------------------------------------------

  return response.data;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default uploadImage;