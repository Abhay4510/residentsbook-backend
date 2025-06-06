const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title/Role is required"],
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for better query performance
residentSchema.index({ firstName: 1, lastName: 1 });
residentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Resident", residentSchema);