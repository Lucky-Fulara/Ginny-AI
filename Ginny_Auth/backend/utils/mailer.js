const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
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

    return transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
