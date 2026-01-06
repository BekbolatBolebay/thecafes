import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const twilio = require("twilio")

export async function POST(request: Request) {
  try {
    const { cart, total, user } = await request.json()

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Twilio configuration
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    )

    // Create order summary
    const orderItems = cart
      .map((item: any) => `${item.name} x${item.quantity} - ${item.price * item.quantity}₸`)
      .join("\n")

    // Send Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b6b;">Order Confirmation</h2>
        <p>Dear ${user?.name || "Customer"},</p>
        <p>Thank you for your order! Here are the details:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Items:</h3>
          <pre style="white-space: pre-wrap;">${orderItems}</pre>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;" />
          <p style="font-size: 18px; font-weight: bold;">Total: ${total}₸</p>
        </div>
        <p>Your order will be delivered soon. We'll keep you updated!</p>
        <p style="color: #666; font-size: 14px;">If you have any questions, please contact us.</p>
      </div>
    `

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "bolebay.bekbolat.25@gmail.com",
        to: user?.email || "bolebay.bekbolat.25@gmail.com",
        subject: "Order Confirmation - Food Delivery",
        html: emailHtml,
      })
      console.log("[v0] Email sent successfully")
    } catch (emailError) {
      console.error("[v0] Email error:", emailError)
    }

    // Send SMS
    const smsMessage = `Order confirmed! Total: ${total}₸. Your food will be delivered soon. Thank you for ordering!`

    try {
      await twilioClient.messages.create({
        body: smsMessage,
        from: process.env.TWILIO_PHONE_NUMBER || "+87076901645",
        to: user?.phone || "+77076901645",
      })
      console.log("[v0] SMS sent successfully")
    } catch (smsError) {
      console.error("[v0] SMS error:", smsError)
    }

    return NextResponse.json({ success: true, message: "Notifications sent" })
  } catch (error) {
    console.error("[v0] Notification error:", error)
    return NextResponse.json({ success: false, error: "Failed to send notifications" }, { status: 500 })
  }
}
