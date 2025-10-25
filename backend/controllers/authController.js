import crypto from 'crypto';
import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendMail from "../utils/sendEmail.js";

dotenv.config()

export const signup = async (req, res) => {

    // console.log(req.body)

    try {

        const { firstName, middleName, lastName, gender, email, phone, password, dob } = req.body

        // Check if all the required fields are present
        if (!firstName || !lastName || !gender || !email || !phone || !password || !dob) {
            return res.status(400).json({ message: 'All the required fields were not filled' })
        }

        // Check if password:
        //  1. alphanumeric 
        //  2. both upper case and lower case
        //  3. atleast with special character
        //  4. minimum length is 8
        function validatePassword(password) {
            if (password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long." })
            }
            if (!/[a-z]/.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one lowercase letter." })
            }
            if (!/[A-Z]/.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one uppercase letter." })
            }
            if (!/\d/.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one number." })
            }
            if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one special character." })
            }

        }
        validatePassword(password);

        // Check if email is already registered
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Check if phone is already registered
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Validate DOB
        const dob_validator = (value) => {
            // user age cannot be less than minimum required age
            const today = new Date();
            const minAge = process.env.USER_MIN_AGE;
            const birthDate = new Date(value);

            //user age cannot be in the future
            if (today < birthDate) {
                return res.status(400).json({ message: `Date of birth cannot be in the future` });
            }

            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < minAge) {
                return res.status(400).json({ message: `Given age ${age} is less than minimum required age ${minAge}` });
            }
        }
        dob_validator(dob);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const nextId = await User.getNextId();
        const newUser = new User({
            id: nextId,
            firstName,
            middleName,
            lastName,
            gender,
            email,
            phone,
            password: hashedPassword,
            dob,
            role: 'user'
        });
        await newUser.save();

        res.status(200).json({
            message: 'User registered successfully',
            user: {
                firstName: newUser.firstName,
                middleName: newUser.middleName,
                lastName: newUser.lastName,
                age: newUser.age,
                gender: newUser.gender,
                email: newUser.email,
                phone: newUser.phone,
                userName: newUser.userName,
                password: newUser.password,
                dob: newUser.dob,
                role: newUser.role
            }
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Signup Server Error: ${error}` })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { email: user.email, role: user.role, firstName: user.firstName },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "Login Successful",
            success: true,
            user: {
                firstName: user.firstName,
                _id: user.id,
            },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: `Login Server Error: ${error.message}` });
    }
};


// POST /forgot-password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // 1️⃣ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Generate a secure token
        const resetToken = user.getResetToken()
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // 3️⃣ Save token and expiry in user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // 4️⃣ Create reset link
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

        // 5️⃣ Create email HTML
        const htmlContent = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. The link is valid for 1 hour.</p>
      <a href="${resetUrl}">Reset Password</a>
    `;

        // 6️⃣ Send email
        await sendMail(email, "Reset Your Password", htmlContent);

        res.json({ message: "Password reset link sent to your email." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error. Try again later." });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};