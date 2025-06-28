import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

// Signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    console.log("Signup Request Body:", req.body);
    
    try {
        if (!fullName || !password || !email || !bio) {
            console.log("Missing fields in signup");
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            console.log("User already exists:", email);
            return res.json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed successfully");

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });
        console.log("New user created:", newUser._id);

        const token = generateToken(newUser._id);
        console.log("Token generated for new user");

        res.json({ success: true, userData: newUser, token, message: "Account created successfully" });

    } catch (error) {
        console.log("Signup Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};


// Login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Attempt:", email);

        const userData = await User.findOne({ email });
        if (!userData) {
            console.log("User not found:", email);
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            console.log("Incorrect password for user:", email);
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = generateToken(userData._id);
        console.log("Login successful, token issued:", token);

        res.json({ success: true, userData: userData, token, message: "Login successful" });

    } catch (error) {
        console.log("Login Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};


// Check Auth
export const checkAuth = (req, res) => {
    console.log("Auth Check for user:", req.user?._id);
    res.json({ success: true, user: req.user });
};


// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;

        console.log("Profile update request for user:", userId);
        console.log("Received fields - fullName:", fullName, "| bio:", bio, "| profilePic:", profilePic ? "Yes" : "No");

        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            );
            console.log("User profile updated without image:", updatedUser._id);
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            console.log("Image uploaded to Cloudinary:", upload.secure_url);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, bio, fullName },
                { new: true }
            );
            console.log("User profile updated with image:", updatedUser._id);
        }

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log("Update Profile Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};
