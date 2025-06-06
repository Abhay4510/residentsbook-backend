const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "residents-book",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 300, height: 300, crop: "fill", quality: "auto" }
    ],
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size allowed is 5MB.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded.",
      });
    }
  }
  
  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: "Only image files (jpg, jpeg, png, webp) are allowed.",
    });
  }

  next(error);
};

module.exports = {
  upload,
  handleMulterError,
};