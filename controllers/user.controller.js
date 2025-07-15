const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const indianStates = require("../service/stateData");
const {
  uploadToCloudinary,
  cloudinary,
} = require("../service/cloudinaryService");

const getUserDetailsController = async (req, res) => {
  const { userId } = req.body;
  try {
    const findUser = await userModel
      .findOne({
        _id: userId,
      })
      .select("-password");
    if (!findUser) {
      return res.status(404).send({
        success: false,
        mesage: "User not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      userdetails: findUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get user details api",
      error,
    });
  }
};

const updateUserDetailsController = async (req, res) => {
  //const { userId, role } = req.user;
  const { userId } = req.body;
  let {
    fullName,
    dateOfBirth,
    gender,
    mobileNumber,
    emailID,
    password,
    confirmPassword,
    adhaarNumber,
    panNumber,
    addressLine1,
    addressLine2,
    state,
    city,
    pinCode,
  } = req.body;

  if (!fullName || fullName.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Full Name is required",
    });
  } else if (!dateOfBirth || dateOfBirth.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Date Of Birth is required",
    });
  } else if (!gender || gender.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Gender is required",
    });
  } else if (!mobileNumber || mobileNumber.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Mobie Number is required",
    });
  } else if (!emailID || emailID.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Email is required",
    });
  } else if (!password || password.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "password is required",
    });
  } else if (!confirmPassword || confirmPassword.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Confirm Password is required",
    });
  } else if (password.trim() !== confirmPassword.trim()) {
    return res.status(400).send({
      success: false,
      message: "Password and Confirm Password are not equal",
    });
  } else if (!adhaarNumber || adhaarNumber.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Adhaar Number is required",
    });
  } else if (!panNumber || panNumber.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Pan Number is required",
    });
  } else if (!addressLine1 || addressLine1.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Address Line 1 is required",
    });
  } else if (!addressLine2 || addressLine2.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Address Line 2 is required",
    });
  } else if (!state || state.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "state is required",
    });
  } else if (!city || city.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "City is required",
    });
  } else if (!pinCode || pinCode.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Pincode is required",
    });
  }

  const updateData = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
  if (gender !== undefined) updateData.gender = gender;
  if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
  if (emailID !== undefined) updateData.emailID = emailID;
  if (password !== undefined) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }
  if (adhaarNumber !== undefined) updateData.adhaarNumber = adhaarNumber;
  if (panNumber !== undefined) updateData.panNumber = panNumber;
  if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1;
  if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2;
  if (state !== undefined) updateData.state = state;
  if (city !== undefined) updateData.city = city;
  if (pinCode !== undefined) updateData.pinCode = pinCode;

  // Update the user
  const updatedUser = await userModel
    .findOneAndUpdate({ _id: userId }, updateData, { new: true })
    .select("-password");

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
};

const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId && userId.trim() === "") {
      return res
        .status(404)
        .json({ success: false, message: "Please provide User Id" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.image_public_id) {
      console.log("Deleting image:", user.image_public_id);
      await cloudinary.uploader.destroy(user.image_public_id, {
        resource_type: "image",
      });
    }
    if (user.video_public_id) {
      await cloudinary.uploader.destroy(user.video_public_id, {
        resource_type: "video",
      });
    }

    await userModel.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const getAlluserDetails = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { adhaarNumber, fullName, gender, mobileNumber, state } = req.body;

    const page = parseInt(req.body?.page) || 1;
    const limit = parseInt(req.body?.limit) || 10;

    const skip = (page - 1) * limit;
    let filter = {};

    if (adhaarNumber) filter.adhaarNumber = adhaarNumber.trim();
    if (fullName) filter.fullName = { $regex: fullName.trim(), $options: "i" };
    if (gender) filter.gender = gender.trim();
    if (mobileNumber) filter.mobileNumber = mobileNumber.trim();
    if (state) filter.state = state.trim();

    const users = await userModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const totalUsers = await userModel.countDocuments();

    const updatedUsers = users?.map((user) => {
      const canEdit =
        role === "admin" ? true : String(user._id) === String(userId);
      return {
        ...user.toObject(),
        edit: canEdit,
      };
    });

    if (role !== "admin") {
      const currentUserIndex = updatedUsers.findIndex(
        (user) => String(user._id) === String(userId)
      );

      if (currentUserIndex !== -1) {
        const currentUser = updatedUsers.splice(currentUserIndex, 1)[0];
        updatedUsers.unshift(currentUser);
      }
    }

    return res.status(200).json({
      data: updatedUsers,
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit),
      success: true,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch data" });
  }
};

const getStateList = async (req, res) => {
  res.json({
    success: true,
    data: indianStates,
  });
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res
        .status(413)
        .json({ success: false, message: "Image size should be max 5 MB" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      message: "image upload successfully",
      imageUrl: result.secure_url,
      image_public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const maxSize = 10 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res
        .status(413)
        .json({ success: false, message: "Video size should be max 10 MB" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "video");

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      videoUrl: result.secure_url,
      video_public_id: result.public_id,
    });
  } catch (error) {
    console.error("Video Upload Error:", error);
    res.status(500).json({ message: "Video upload failed" });
  }
};

module.exports = {
  getUserDetailsController,
  updateUserDetailsController,
  deleteUserController,
  getAlluserDetails,
  getStateList,
  uploadImage,
  uploadVideo,
};
