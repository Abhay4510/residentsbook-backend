const express = require("express");
const router = express.Router();
const {
  getAllResidents,
  createResident,
  getResidentById,
  updateResident,
  deleteResident,
} = require("../controllers/residentController");
const { upload, handleMulterError } = require("../middleware/upload");


router.get("/", getAllResidents);

router.post("/", upload.single("profileImage"), handleMulterError, createResident);

router.get("/:id", getResidentById);


module.exports = router;