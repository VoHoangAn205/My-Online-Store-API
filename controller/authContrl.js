const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/emailConfig");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "This email address has not been registered yet" });
  }

  const invalidCount = foundUser?.invalidLoginCount;
  if (invalidCount >= 5) {
    return res.status(403).json({
      message:
        "Your account has been locked due to more than 5 incorrect attempts",
    });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          id: foundUser._id,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 24 * 60 * 60 * 1000 },
    );

    const result = await User.findByIdAndUpdate(
      foundUser._id,
      { refreshToken, invalidLoginCount: 0 },
      { returnDocument: "after" },
    ).exec();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } else {
    let count = invalidCount ? invalidCount + 1 : 1;

    foundUser.invalidLoginCount = count;
    await foundUser.save();

    if (count >= 5) {
      const emailHtml = `<div class="email-container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e1e4e8;">
        
        <!-- Header -->
        <div class="header" style="background-color: #de350b; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">Account Temporarily Locked</h1>
        </div>

        <!-- Content -->
        <div class="content" style="padding: 40px 30px; line-height: 1.6;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a4a4a;">Dear Customer,</p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a4a4a;">We detected multiple consecutive failed login attempts on your account. To protect your personal information and maintain your security, your account has been <strong style="font-weight: bold;">temporarily locked</strong>.</p>

            <!-- Warning Box -->
            <div class="warning-box" style="background-color: #ffebe6; border-left: 4px solid #de350b; padding: 15px; margin: 25px 0; border-radius: 0 4px 4px 0;">
                <p style="margin: 0; font-size: 15px; color: #bf2600; font-weight: 500;">⚠️ If this wasn't you, someone may be attempting to access your account. Please take immediate action to secure your login credentials after unlocking your account.</p>
            </div>

            <!-- Next Steps -->
            <div class="steps-box" style="background-color: #f4f5f7; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #253858;">How to unlock your account:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #4a4a4a; font-size: 15px;">
                    <li style="margin-bottom: 8px;">Go directly to our official website by typing the address into your browser.</li>
                    <li style="margin-bottom: 8px;">Navigate to the login screen and click on <strong style="font-weight: bold;">"Forgot Password"</strong> or <strong style="font-weight: bold;">"Unlock Account"</strong>.</li>
                    <li style="margin-bottom: 8px;">Follow the security verification prompts sent to your registered email or phone number.</li>
                </ol>
            </div>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a4a4a;">Once you regain access, we highly recommend changing your password to a strong, unique variation and enabling Two-Factor Authentication (2FA) if you haven't already.</p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a4a4a;">Best regards,<br>
            <strong style="font-weight: bold;">The Security Team</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer" style="background-color: #f4f5f7; padding: 20px; text-align: center; font-size: 12px; color: #7a869a; border-top: 1px solid #e1e4e8;">
            <p style="margin: 0 0 10px 0;">This is an automated security notification. Please do not reply directly to this email.</p>
            <p style="margin: 0;">&copy; HoangAnWebsite Inc. All rights reserved.</p>
        </div>
    </div>`;

      await sendEmail({
        to: foundUser.email,
        subject: "Security Warning From HoangAnWebsite",
        html: emailHtml,
      });

      return res.status(403).json({
        message:
          "Your account has been locked due to more than 5 incorrect attempts",
      });
    } else {
      let attempsRemaining = 5 - count;

      return res.status(401).json({
        message: `Your password is incorrect please try again, you have ${attempsRemaining} attemps left`,
      });
    }
  }
};

module.exports = { handleLogin };
