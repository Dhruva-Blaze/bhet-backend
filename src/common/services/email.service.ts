// common/services/email.service.ts

import nodemailer from "nodemailer";

export const sendContactEmail = async (data: any) => {
  // Parse the message to separate the user's message from the inquiry details (if present)
  let userMessage = data.message || "-";
  let inquiryDetails = "";

  if (typeof userMessage === 'string' && userMessage.includes("--- Inquiry Details ---")) {
    const parts = userMessage.split("--- Inquiry Details ---");
    // Remove "Message: " prefix if it exists at the beginning
    userMessage = parts[0].replace(/^Message:\s*/, "").trim() || "-";
    inquiryDetails = parts[1].trim();
  }

  // Format inquiry details into an HTML list if it exists
  let inquiryItemsHtml = "";
  if (inquiryDetails) {
    // Split by newlines and create list items
    const items = inquiryDetails.split("\n").map(item => item.trim()).filter(item => item);
    
    // Parse items to separate quantity and notes
    const parsedItems = items.map(itemStr => {
      // Example format: "Dell Inspiron 15 Laptop x 5" or "Dell Inspiron 15 Laptop x 5, Note: custom text"
      const parts = itemStr.split(" x ");
      if (parts.length > 1) {
        const rightSide = parts.pop()!;
        const name = parts.join(" x "); // Rejoin just in case the product name had " x " in it
        
        const noteSplit = rightSide.split(", Note: ");
        const quantity = noteSplit[0];
        const note = noteSplit.slice(1).join(", Note: ");
        
        return { name, quantity, note };
      }
      return { name: itemStr, quantity: "", note: "" };
    });

    inquiryItemsHtml = `
      <div style="margin-top: 25px; border-top: 1px solid #eaeaea; padding-top: 20px;">
        <h3 style="color: #1B2A4A; font-size: 16px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Inquiry Details</h3>
        <div style="border: 1px solid #f0f0f0; border-radius: 6px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #f9f9fa; border-bottom: 2px solid #D5A953;">
                <th style="padding: 12px 15px; text-align: left; color: #1B2A4A; font-weight: 600;">Product</th>
                <th style="padding: 12px 15px; text-align: center; color: #1B2A4A; font-weight: 600; width: 100px;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${parsedItems.map((item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#fcfcfc'}; border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 12px 15px; color: #333;">
                    <div style="font-weight: 500;">${item.name}</div>
                    ${item.note ? `<div style="font-size: 12px; color: #666; margin-top: 4px;"><i>Note: ${item.note}</i></div>` : ''}
                  </td>
                  <td style="padding: 12px 15px; text-align: center; color: #333; font-weight: 600;">
                    ${item.quantity || '-'}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e6e6e6; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #1B2A4A; padding: 30px 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">New Inquiry Received</h2>
      </div>
      <div style="padding: 30px 40px;">
        <div style="background-color: #f9f9fa; border: 1px solid #f0f0f0; border-radius: 6px; padding: 20px 25px; margin-bottom: 25px;">
          <h3 style="color: #1B2A4A; font-size: 15px; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Customer Information</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #666; width: 100px; font-weight: 500;">Name:</td>
              <td style="padding: 6px 0; color: #222; font-weight: 600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666; font-weight: 500;">Email:</td>
              <td style="padding: 6px 0;">
                <a href="mailto:${data.email}" style="color: #D5A953; text-decoration: none; font-weight: 500;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666; font-weight: 500;">Contact:</td>
              <td style="padding: 6px 0; color: #222; font-weight: 500;">${data.contact}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 10px;">
          <h3 style="color: #1B2A4A; font-size: 15px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
          <div style="background-color: #ffffff; padding: 15px 20px; border-radius: 6px; color: #444; line-height: 1.6; border: 1px solid #eaeaea; border-left: 3px solid #1B2A4A; font-size: 14px;">
            ${userMessage.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        ${inquiryItemsHtml}
      </div>
      <div style="background-color: #f7f7f7; padding: 20px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eaeaea;">
        <p style="margin: 0;">This email was automatically generated from your Bhet Kendra platform.</p>
      </div>
    </div>
  `;

  // If no password is provided, just log the email to the console (Development Mode)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n=============================");
    console.log("📧 MOCK EMAIL SENT (No credentials provided)");
    console.log(`To: ${process.env.ADMIN_EMAIL || 'Admin'}`);
    console.log("Subject: New Contact Inquiry");
    console.log("-----------------------------");
    console.log(`Name: ${data.name}`);
    console.log(`Email: ${data.email}`);
    console.log(`Contact: ${data.contact}`);
    console.log(`Message: ${userMessage}`);
    if (inquiryDetails) {
      console.log(`\nItems:\n${inquiryDetails}`);
    }
    console.log("=============================\n");
    return;
  }

  // Real email sending if credentials exist
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Bhet" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: data.email, // Allows you to reply directly to the customer
    subject: `New Inquiry from ${data.name}`,
    html: htmlContent,
  });
};
