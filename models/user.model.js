const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
    },

    dateOfBirth: {
      type: String,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile no is required"],
    },
    emailID: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    adhaarNumber: {
      type: String,
      required: [true, "Adhaar is required"],
      unique: true,
    },
    panNumber: {
      type: String,
      required: [true, "PAN no is required"],
      unique: true,
    },
    addressLine1: {
      type: String,
      required: [true, "Address line1 is required"],
    },
    addressLine2: {
      type: String,
      required: [true, "Address line2 is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    pinCode: {
      type: String,
      required: [true, "Pincode is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    video_public_id: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    image_public_id: {
      type: String,
    },
    role: {
      required: true,
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
