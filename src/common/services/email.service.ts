// common/services/email.service.ts

import nodemailer from "nodemailer";

export const sendContactEmail = async (data: any) => {
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
    console.log(`Message: ${data.message || "-"}`);
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
    subject: "New Contact Inquiry",
    html: `
      <h3>New Inquiry</h3>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Contact:</b> ${data.contact}</p>
      <p><b>Message:</b> ${data.message || "-"}</p>
    `,
  });
};
