const Resident = require("../models/Resident");
const cloudinary = require("../config/cloudinary");
const {
  createResidentValidation,
  updateResidentValidation,
} = require("../validations/residentValidation");


exports.getAllResidents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const residents = await Resident.find({ isActive: true })
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resident.countDocuments({ isActive: true });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: "Residents fetched successfully",
      data: {
        residents,
        pagination: {
          currentPage: page,
          totalPages,
          totalResidents: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching residents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching residents",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

exports.createResident = async (req, res) => {
  try {
    const { error, value } = createResidentValidation(req.body);
    if (error) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessage,
      });
    }

    const residentData = {
      firstName: value.firstName,
      lastName: value.lastName,
      title: value.title,
      linkedIn: value.linkedIn || "",
      twitter: value.twitter || "",
    };

    if (req.file) {
      residentData.profileImage = req.file.path;
    }

    const resident = new Resident(residentData);
    await resident.save();

    res.status(201).json({
      success: true,
      message: "Resident added successfully! Welcome to the community! ",
      data: {
        resident: {
          _id: resident._id,
          firstName: resident.firstName,
          lastName: resident.lastName,
          title: resident.title,
          profileImage: resident.profileImage,
          linkedIn: resident.linkedIn,
          twitter: resident.twitter,
          createdAt: resident.createdAt,
        },
      },
    });
  } catch (error) {
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cleanupError) {
        console.error("Error cleaning up uploaded file:", cleanupError);
      }
    }

    console.error("Error creating resident:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A resident with similar details already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating resident",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

exports.getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id).select("-__v");
    
    if (!resident || !resident.isActive) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resident fetched successfully",
      data: { resident },
    });
  } catch (error) {
    console.error("Error fetching resident:", error);
    
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching resident",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};
