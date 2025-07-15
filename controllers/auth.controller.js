const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register Controller
const registerControllers = async (req, res) => {
  let {
    fullName,
    dateOfBirth,
    gender,
    mobileNumber,
    emailID,
    password,
    confirmPassword,
    role,
    adhaarNumber,
    panNumber,
    addressLine1,
    addressLine2,
    state,
    city,
    pinCode,
    imageUrl,
    videoUrl,
    video_public_id,
    image_public_id,
  } = req.body;
  console.log("testttttttttt", adhaarNumber.trim());

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
  } 
    else if (new Date(dateOfBirth) >= new Date()) {
  return res.status(400).send({
    success: false,
    message: "Date Of Birth must be less than current date",
  });
}
else if (!gender || gender.trim() === "") {
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
  } else if (!role || role.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Role is required",
    });
  } else if (!adhaarNumber || adhaarNumber.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Adhaar Number is required",
    });
  } else if (!/^\d{12}$/.test(adhaarNumber.trim())) {
    return res.status(400).send({
      success: false,
      message: "Aadhaar Number must be exactly 12 digits",
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
  } else if (!/^\d{6}$/.test(pinCode.trim())) {
    return res.status(400).send({
      success: false,
      message: "Pincode must be exactly 6 digits",
    });
  } else if (!imageUrl || imageUrl.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Image Url is required",
    });
  } else if (!videoUrl || videoUrl.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Video Url is required",
    });
  }

  try {
    const existingUser = await userModel.findOne({
      $or: [
        { emailID: emailID.toLowerCase() },
        { adhaarNumber },
        { panNumber },
      ],
    });

    if (existingUser) {
      let duplicateField = "";
      if (existingUser.emailID === emailID.toLowerCase()) {
        duplicateField = "Email ID";
      } else if (existingUser.adhaarNumber === adhaarNumber) {
        duplicateField = "Aadhaar Number";
      } else if (existingUser.panNumber === panNumber) {
        duplicateField = "PAN Number";
      }

      return res.status(400).json({
        success: false,
        message: `${duplicateField} already exist`,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = {
      fullName,
      dateOfBirth,
      gender,
      mobileNumber,
      emailID: emailID.toLowerCase(),
      role,
      adhaarNumber,
      panNumber,
      addressLine1,
      addressLine2,
      state,
      city,
      pinCode,
      password: hashedPassword,
      imageUrl,
      videoUrl,
      video_public_id,
      image_public_id,
    };

    await userModel.create(newUser);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

//Login Controller
const loginControllers = async (req, res) => {
  const { emailID, password } = req.body;

  if (!emailID || emailID.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Email is required",
    });
  } else if (!password || password.trim() === "") {
    return res.status(400).send({
      success: false,
      message: "Password is required",
    });
  }

  try {
    const user = await userModel.findOne({ emailID: emailID.toLowerCase() });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    //compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).send({
      success: true,
      name: user.fullName,
      role: user.role,
      user_id: user._id,
      message: "Login successfull",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

module.exports = {
  registerControllers,
  loginControllers,
};
