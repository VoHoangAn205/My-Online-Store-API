const vendorRequestEmail = (info) => {
  const { username, email, id: _id } = info;
  const requestDate = new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Vendor Upgrade Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-top: 0;">🔔 New Vendor Upgrade Request</h2>
        <p>A user has requested to upgrade their account to Vendor status.</p>
        
        <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Username:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${username}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>User ID:</strong></td>
            <td style="padding: 8px 0; font-family: monospace; border-bottom: 1px solid #eee;">${_id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Date:</strong></td>
            <td style="padding: 8px 0;">${requestDate}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
};

module.exports = vendorRequestEmail;
