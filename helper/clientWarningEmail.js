const clientWarningEmail = () => {
  return `<div class="email-container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e1e4e8;">
        
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
};
module.exports = clientWarningEmail;
