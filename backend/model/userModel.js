import mongoose from "mongoose";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({

  id: {
        type: Number,
        unique: true,       // ensures no duplicate ids
        required: true,
    },

    
    firstName: {
        type: String,
        required: [true, "First name is required"],
        unique: false,
        trim: true
    },

    middleName: {
        type: String,
        required: [false, "Middle name is optional"],
        unique: false,
        trim: true,
        default: ''
    },

    lastName: {
        type: String,
        required: [true, "Last name is required"],
        unique: false,
        trim: true
    },

    gender: {
        type: String,
        required: [false, "Gender is optional"],
        unique: false,
        trim: true
    },

    phone: {
        type: Number,
        required: [true, "Phone number is required"],
        unique: false,
        trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,          // ensures no duplicate emails
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Email is required"],
      unique: false,          // ensures no duplicate emails
      minlength: 10
    },

    dob: {
      type: Date,
      required: [true, "Date of birth is required"]
    },

    role: {
        type: String,
        required: true,
        unique: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token (to store securely)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration (15 min)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

userSchema.statics.getNextId = async function () {
  const maxUser = await this.findOne().sort({ id: -1 }).select('id').lean();
  return maxUser ? maxUser.id + 1 : 1; // start from 1 if no users exist
};

const User = mongoose.model("user", userSchema)

export default User;