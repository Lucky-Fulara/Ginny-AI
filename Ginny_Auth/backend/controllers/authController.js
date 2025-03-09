const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');  // Optional if you want JWT login response
const User = require("../models/User");

// ✅ Temporary store for OTPs (for registration only in this version)
let otps = {};

// ✅ Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Central Error Handler
const handleError = (res, error, message = "❌ Server error.") => {
    console.error(message, error);
    res.status(500).json({ message });
};

// ✅ Generate a 5-digit OTP
const generateOTP = () => Math.floor(10000 + Math.random() * 90000).toString();

// ✅ Start Registration - Send OTP to email
const startRegistration = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "❌ User already exists!" });
        }

        const otp = generateOTP();
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash before storing

        otps[email] = {
            otp,
            hashedPassword,
            expiresAt: Date.now() + 5 * 60 * 1000  // 5 minutes expiry
        };

        const mailOptions = {
            from: `Ginny AI <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Secure OTP Code - Complete Registration',
            html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 500px; margin: auto; padding: 20px;
                border-radius: 12px; background: url('https://cdn.pixabay.com/photo/2024/01/26/14/18/cyborg-8534055_1280.png') no-repeat center center/cover;
                color: #fff; text-align: center; box-shadow: 0 0 50px rgba(0, 255, 255, 0.9); 
                position: relative; overflow: hidden;">
    
                <!-- Full Background Shadow Overlay -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.8); box-shadow: 0 0 50px rgba(0, 255, 255, 0.8);
                    z-index: 0;">
                </div>
                
                <!-- Translucent Content Box -->
                <div style="position: relative; background: rgba(0, 0, 0, 0.6); padding: 20px;
                    border-radius: 10px; box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.5); z-index: 1;">
                    
                    <h2 style="color: #00FFFF; font-size: 28px; text-transform: uppercase;
                        font-weight: bold; letter-spacing: 2px;">
                        Ginny AI
                    </h2>
                    
                    <p style="font-size: 16px; color: #EEE;">
                        Here is your One-Time Password (OTP) to proceed with registration.
                    </p>
                    
                    <div style="margin: 20px 0;">
                        <span style="font-size: 36px; font-weight: bold; color: #00FFFF; padding: 14px 26px;
                            border-radius: 12px; background: rgba(0, 255, 255, 0.2);
                            box-shadow: 0 0 30px rgba(0, 255, 255, 0.9), inset 0 0 15px rgba(0, 255, 255, 0.5);
                            display: inline-block; letter-spacing: 5px;">
                            ${otp}
                        </span>
                    </div>
                    
                    <p style="font-size: 14px; color: #DDD;">
                        This OTP is valid for <strong>5 minutes</strong>. Keep it secure and do not share it.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #00FFFF; margin: 20px 0;">
                    
                    <p style="font-size: 14px; color: #AAA;">
                        If you did not request this OTP, you may ignore this email.
                    </p>
                    
                    <p style="font-size: 12px; color: #888;">
                        &copy; ${new Date().getFullYear()} Ginny AI. All rights reserved.
                    </p>
                </div>
            </div>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email}: ${otp}`);

        res.status(200).json({ message: "✅ OTP sent to your email. Please verify to complete registration." });

    } catch (error) {
        handleError(res, error, "❌ Error starting registration");
    }
};

// ✅ Complete Registration - Verify OTP & Save User
const verifyRegistrationOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const storedOtpData = otps[email];
        if (!storedOtpData) {
            return res.status(400).json({ message: "❌ No OTP found for this email." });
        }

        if (storedOtpData.otp !== otp || Date.now() > storedOtpData.expiresAt) {
            return res.status(400).json({ message: "❌ Invalid or expired OTP." });
        }

        const newUser = new User({
            email,
            password: storedOtpData.hashedPassword,
            isVerified: true // ✅ Set after successful OTP verification
        });

        await newUser.save();
        delete otps[email];

        res.status(201).json({ message: "✅ Registration complete!" });

    } catch (error) {
        handleError(res, error, "❌ Error verifying registration OTP");
    }
};

// ✅ Resend OTP During Registration
const resendRegistrationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!otps[email]) {
            return res.status(400).json({ message: "❌ No registration process found for this email." });
        }

        const newOtp = generateOTP();
        otps[email].otp = newOtp;
        otps[email].expiresAt = Date.now() + 5 * 60 * 1000;  // Reset expiry to 5 minutes

        const mailOptions = {
            from: `Ginny AI <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Secure OTP Code - Complete Registration',
            html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 500px; margin: auto; padding: 20px;
                border-radius: 12px; background: url('https://cdn.pixabay.com/photo/2024/01/26/14/18/cyborg-8534055_1280.png') no-repeat center center/cover;
                color: #fff; text-align: center; box-shadow: 0 0 50px rgba(0, 255, 255, 0.9); 
                position: relative; overflow: hidden;">
    
                <!-- Full Background Shadow Overlay -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.8); box-shadow: 0 0 50px rgba(0, 255, 255, 0.8);
                    z-index: 0;">
                </div>
                
                <!-- Translucent Content Box -->
                <div style="position: relative; background: rgba(0, 0, 0, 0.6); padding: 20px;
                    border-radius: 10px; box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.5); z-index: 1;">
                    
                    <h2 style="color: #00FFFF; font-size: 28px; text-transform: uppercase;
                        font-weight: bold; letter-spacing: 2px;">
                        Ginny AI
                    </h2>
                    
                    <p style="font-size: 16px; color: #EEE;">
                        Here is your One-Time Password (OTP) to proceed with registration.
                    </p>
                    
                    <div style="margin: 20px 0;">
                        <span style="font-size: 36px; font-weight: bold; color: #00FFFF; padding: 14px 26px;
                            border-radius: 12px; background: rgba(0, 255, 255, 0.2);
                            box-shadow: 0 0 30px rgba(0, 255, 255, 0.9), inset 0 0 15px rgba(0, 255, 255, 0.5);
                            display: inline-block; letter-spacing: 5px;">
                            ${otp}
                        </span>
                    </div>
                    
                    <p style="font-size: 14px; color: #DDD;">
                        This OTP is valid for <strong>5 minutes</strong>. Keep it secure and do not share it.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #00FFFF; margin: 20px 0;">
                    
                    <p style="font-size: 14px; color: #AAA;">
                        If you did not request this OTP, you may ignore this email.
                    </p>
                    
                    <p style="font-size: 12px; color: #888;">
                        &copy; ${new Date().getFullYear()} Ginny AI. All rights reserved.
                    </p>
                </div>
            </div>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Resent OTP to ${email}: ${newOtp}`);

        res.status(200).json({ message: "✅ New OTP sent to your email." });

    } catch (error) {
        handleError(res, error, "❌ Error resending OTP");
    }
};

// ✅ Login User (Now checks `isVerified`)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ User not found!" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "❌ Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "❌ Incorrect password!" });
        }

        // Optional: Generate JWT Token
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: "✅ Login successful!",
            // token  // Uncomment if you're using JWT
        });

    } catch (error) {
        handleError(res, error, "❌ Error logging in");
    }
};

// ✅ Export All Controllers
module.exports = {
    startRegistration,      // Step 1 - Start registration & send OTP
    verifyRegistrationOTP,  // Step 2 - Complete registration after OTP verification
    resendRegistrationOTP,  // Resend OTP if needed
    loginUser                // Login after registration
};
