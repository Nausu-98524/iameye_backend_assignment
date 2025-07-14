const express = require("express");
const multer = require("multer");
const {
  getUserDetailsController,
  updateUserDetailsController,
  deleteUserController,
  getAlluserDetails,
  getStateList,
  uploadImage,
  uploadVideo,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/get-user-details", authMiddleware, getUserDetailsController);
router.post(
  "/update-user-details",
  authMiddleware,
  updateUserDetailsController
);
router.post("/delete-user-details", authMiddleware, deleteUserController);

router.post("/get-all-user-details", authMiddleware, getAlluserDetails);

router.post("/get-state-list", getStateList);

router.post("/upload-image", upload.single("image"), uploadImage);

router.post("/upload-video", upload.single("video"), uploadVideo);

module.exports = router;
