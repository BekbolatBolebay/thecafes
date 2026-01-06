"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useTranslation } from "@/components/theme-language-toggle"
import { getSupabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Generate 6-digit code
      const code = Math.random().toString().slice(2, 8).padEnd(6, "0")
      
      // Send email with code
      const emailResponse = await fetch("/api/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
        }),
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json()
        throw new Error(errorData.error || "Email жіберу қатесі")
      }

      // Store code in sessionStorage for verification
      sessionStorage.setItem("resetCode", code)
      sessionStorage.setItem("resetEmail", email)

      setSuccessMessage("✓ Растау коды email-ға жіберілді")
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Қате орын тұтты")
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Verify code
    const storedCode = sessionStorage.getItem("resetCode")
    if (verificationCode !== storedCode) {
      setError("Растау коды дұрыс емес")
      return
    }

    setStep(3)
    setSuccessMessage("")
  }

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Құпиясөздер сәйкес емес")
      }

      if (newPassword.length < 6) {
        throw new Error("Құпиясөз кемінде 6 таңбадан болуы керек")
      }

      const supabase = getSupabase()
      if (!supabase) {
        throw new Error("Supabase қосындысы табылмады")
      }

      // Get stored email
      const storedEmail = sessionStorage.getItem("resetEmail")
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Clear session storage
      sessionStorage.removeItem("resetCode")
      sessionStorage.removeItem("resetEmail")

      setSuccessMessage("✅ Құпиясөз сәтті өзгертілді! Қайталықтап кіріңіз.")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Қате орын тұтты")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/login" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-semibold text-lg">Құпиясөзді қалпына келтіру</h1>
        </div>
      </header>

      <div className="px-4 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Құпиясөзді қалпына келтіру</h2>
          <p className="text-sm text-muted-foreground">
            {step === 1 && "Email-ыңыз арқылы құпиясөзді қалпына келтіріңіз"}
            {step === 2 && "Сіздің email-ыңызға жіберілген кодты енгізіңіз"}
            {step === 3 && "Жаңа құпиясөз құрыңыз"}
          </p>
        </div>

        <div className="flex gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full transition ${step >= 1 ? "bg-accent" : "bg-muted"}`} />
          <div className={`h-1 flex-1 rounded-full transition ${step >= 2 ? "bg-accent" : "bg-muted"}`} />
          <div className={`h-1 flex-1 rounded-full transition ${step >= 3 ? "bg-accent" : "bg-muted"}`} />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Email адресі</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Сіздің тіркеуге пайдаланған email адресін жазыңыз
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Жіберіліп жатыр..." : "Растау кодын аудару"}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-accent hover:underline text-sm font-medium">
                Кіру бетіне қайту
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Растау коды</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-accent/20 font-mono"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Email-ыңызда алған 6 таңбалы кодты енгізіңіз
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-xl transition-all active:scale-95"
            >
              Келесіге өту
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setError("")
                setSuccessMessage("")
                setVerificationCode("")
              }}
              className="w-full text-accent hover:underline text-sm font-medium py-2"
            >
              Кодты қайта аудару
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Жаңа құпиясөз</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Құпиясөзді растаңыз</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Құпиясөз кемінде 6 таңба</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Жүргіліп жатыр..." : "Құпиясөзді өзгерту"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setError("")
                setSuccessMessage("")
              }}
              className="w-full text-accent hover:underline text-sm font-medium py-2"
            >
              Басынан бастау
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
