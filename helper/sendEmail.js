const { promises } = require("nodemailer/lib/xoauth2");
const transporter = require("../config/emailConfig");
const renderHtmlEmailItem = require("./renderHtmlEmailItem");
const renderHtmlForShop = require("./renderHtmlForShop");

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);

    if (info.rejected.length > 0) {
      console.warn("warning: Some recipients were rejected: ", info.rejected);
    }
    return info;
  } catch (err) {
    switch (err.code) {
      case "ECONNECTION":
      case "ETIMEDOUT":
        console.error("Network error - retry later:", err.message);
        break;
      case "EAUTH":
        console.error("Authentication failed:", err.message);
        break;
      case "EENVELOPE":
        console.error("Invalid recipients:", err.rejected);
        break;
      default:
        console.error("Send failed:", err.message);
    }
    throw err;
  }
};

const sendBackgroundOrderEmail = (
  username,
  clientEmail,
  totalPrice,
  OrderItem,
  vendorData,
) => {
  const emailPromises = [];

  emailPromises.push(
    sendEmail({
      to: clientEmail,
      subject: "Order Placed!",
      html: `<div class="email-container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e1e4e8;">
            
            <!-- Header -->
            <div class="header" style="background-color: #00875a; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">Thank You for Your Purchase!</h1>
            </div>
    
            <!-- Content -->
            <div class="content" style="padding: 40px 30px; line-height: 1.6;">
                <p style="margin: 0 0 10px 0; font-size: 16px; color: #4a4a4a;">Hi ${username}</p>
                <p style="margin: 0 0 25px 0; font-size: 16px; color: #4a4a4a;">We've received your order and are getting it ready. You will receive another email with your tracking information as soon as your package ships.</p>
    
                <!-- Order Summary Title -->
                <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #253858; border-bottom: 2px solid #f4f5f7; padding-bottom: 8px;">Order Details</h3>
    
                <!-- Item Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                    <thead>
                        <tr style="border-bottom: 1px solid #e1e4e8; text-align: left;">
                            <th style="padding: 8px 0; color: #7a869a; font-weight: 600;">Item</th>
                            <th style="padding: 8px 0; color: #7a869a; font-weight: 600; text-align: center;">Qty</th>
                            <th style="padding: 8px 0; color: #7a869a; font-weight: 600; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderHtmlEmailItem(OrderItem)}
                        <!-- Totals -->
                        <tr>
                            <td colspan="2" style="padding: 12px 0 4px 0; color: #7a869a; text-align: right;">Subtotal:</td>
                            <td style="padding: 12px 0 4px 0; color: #333333; text-align: right;">${totalPrice}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding: 4px 0; color: #7a869a; text-align: right;">Shipping:</td>
                            <td style="padding: 4px 0; color: #333333; text-align: right;">Free</td>
                        </tr>
                        <tr style="font-weight: bold; font-size: 16px;">
                            <td colspan="2" style="padding: 12px 0; color: #253858; text-align: right; border-top: 1px solid #e1e4e8;">Total paid:</td>
                            <td style="padding: 12px 0; color: #00875a; text-align: right; border-top: 1px solid #e1e4e8;">${totalPrice}</td>
                        </tr>
                    </tbody>
                </table>
    
                <!-- Shipping Info Box -->
                <div class="info-box" style="background-color: #f4f5f7; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #7a869a; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h4>
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #333333;">
                        ${username}<br>
                        123 Main Street, Apt 4B<br>
                        New York, NY 10001
                    </p>
                    <div style="border-top: 1px solid #e1e4e8; padding-top: 10px; font-size: 13px; color: #7a869a; line-height: 1.4;">
                        ℹ️ <em>Because this website is a personal project and no actual transactions take place, we will not collect your address.</em>
                    </div>
                </div>
    
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a4a4a;">If you have any questions about your order, simply reply to this email. We're always here to help.</p>
                
                <p style="margin: 0; font-size: 16px; color: #4a4a4a;">Warm regards,<br>
                <strong style="font-weight: bold;">The Team</strong></p>
            </div>
    
            <!-- Footer -->
            <div class="footer" style="background-color: #f4f5f7; padding: 20px; text-align: center; font-size: 12px; color: #7a869a; border-top: 1px solid #e1e4e8;">
                <p style="margin: 0 0 10px 0;">You received this email because you made a purchase from our store.</p>
                <p style="margin: 0;">&copy; 2026 HoangAnWebsite Inc. All rights reserved.</p>
            </div>
        </div>`,
    }),
  );

  vendorData.forEach((data) => {
    emailPromises.push(
      sendEmail({
        to: data.shopEmail,
        subject: "Your store has received a new order",
        html: `<div class="email-container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e1e4e8;">
        
        <!-- Header -->
        <div class="header" style="background-color: #0052cc; padding: 25px 30px; display: table; width: 100%; box-sizing: border-box;">
            <div style="display: table-cell; vertical-align: middle;">
                <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">🎉 New Order Received</h1>
            </div>
        </div>

        <!-- Content -->
        <div class="content" style="padding: 30px; line-height: 1.6;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">You have a new order waiting to be fulfilled. Here is a breakdown of the transaction details:</p>

            <!-- Grid Layout for Customer and Order Metadata -->
            <table style="width: 100%; margin-bottom: 25px; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="width: 50%; padding: 10px 10px 10px 0; vertical-align: top;">
                        <strong style="color: #7a869a; text-transform: uppercase; font-size: 12px; display: block; margin-bottom: 5px;">Customer Details</strong>
                        <span style="color: #333333; font-weight: 500;">${data.shopName}</span>
                        555-0199
                    </td>
                    <td style="width: 50%; padding: 10px 0 10px 10px; vertical-align: top; border-left: 1px solid #e1e4e8;">
                        <strong style="color: #7a869a; text-transform: uppercase; font-size: 12px; display: block; margin-bottom: 5px;">Shipping Method</strong>
                        <span style="color: #333333; font-weight: 500;">Standard Free Shipping</span><br>
                        <strong style="color: #7a869a; text-transform: uppercase; font-size: 12px; display: block; margin: 10px 0 5px 0;">Payment Method</strong>
                        <span style="color: #333333; font-weight: 500;">Stripe (Visa **** 4242)</span>
                    </td>
                </tr>
            </table>

            <!-- Order Items -->
            <h3 style="margin: 20px 0 10px 0; font-size: 16px; color: #253858;">Items to Ship</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f4f5f7; border-bottom: 1px solid #e1e4e8; text-align: left;">
                        <th style="padding: 10px; color: #253858; font-weight: 600;">Product</th>
                        <th style="padding: 10px; color: #253858; font-weight: 600; text-align: center; width: 60px;">Qty</th>
                        <th style="padding: 10px; color: #253858; font-weight: 600; text-align: right; width: 80px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderHtmlForShop(data.orderItems)}
                </tbody>
            </table>

            <!-- Call to Action Button -->
            <div style="text-align: center; margin-bottom: 10px;">
                <a href="#" style="background-color: #0052cc; color: #ffffff; padding: 12px 30px; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 4px; display: inline-block;">Fulfill Order in Dashboard</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer" style="background-color: #f4f5f7; padding: 20px; text-align: center; font-size: 12px; color: #7a869a; border-top: 1px solid #e1e4e8;">
            <p style="margin: 0;">This notification was automatically triggered by YourStore Platform.</p>
        </div>
    </div>`,
      }),
    );
  });

  Promise.allSettled(emailPromises).then((results) => {
    results.forEach((result, index) => {
      const reciptientType = index === 0 ? "Buyer" : "shop vendor";

      if (result.status === "fulfilled") {
        console.log(
          `[EMAIL SUCCESS] Dispatched successfully to ${reciptientType}`,
        );
      } else {
        console.error(
          `[EMAIL CRITICAL FAILURE] Failed sending to ${reciptientType}. Reason:`,
          result.reason.message,
        );
      }
    });
  });
};

module.exports = { sendEmail, sendBackgroundOrderEmail };
