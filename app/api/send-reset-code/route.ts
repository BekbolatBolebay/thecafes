import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Create email transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email және код қажет" },
        { status: 400 }
      )
    }

    // Send email using Gmail SMTP
    try {
      const transporter = createTransporter()
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Құпиясөз қалпына келтіру коды",
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <h2>Құпиясөз қалпына келтіру</h2>
            <p>Сәлем</p>
            <p>Құпиясөзіңізді қалпына келтіру үшін төмендегі кодты пайдаланыңыз:</p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="letter-spacing: 10px; font-size: 32px; margin: 0; color: #333;">${code}</h1>
            </div>
            <p>Бұл код 30 минут ішінде ескі болады.</p>
            <p>Егер сіз бұл сұрау жіберсеңіз, ешқандай ғана айтқанда істеуге болмайды.</p>
            <p>Ыстық сәлеметтік,<br/>Food Delivery Team</p>
          </div>
        `,
      })

      return NextResponse.json(
        { success: true, message: "Растау коды email-ға жіберілді" },
        { status: 200 }
      )
    } catch (emailError) {
      console.error("[v0] Email sending error:", emailError)
      return NextResponse.json(
        { error: "Email жіберілмеді. EMAIL_USER және EMAIL_PASS .env.local-қа қосыңыз" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: "Сервер қатесі орын тұтты" },
      { status: 500 }
    )
  }
}