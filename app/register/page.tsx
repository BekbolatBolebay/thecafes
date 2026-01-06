"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslation } from "@/components/theme-language-toggle"
import { cities } from "@/lib/data"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verificationSent, setVerificationSent] = useState(false)
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    address: "",
    verificationCode: "",
  })

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError(t("genericError"))
      return
    }
    if (formData.password.length < 6) {
      setError(t("genericError"))
      return
    }
    setStep(2)
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.city) {
      setError(t("genericError"))
      return
    }
    
    setIsLoading(true)
    // Send verification code and move to next step only if it succeeds
    const sent = await sendVerificationCode()
    setIsLoading(false)
    
    if (sent) {
      setResendCooldown(60)
      setStep(3)
    }
  }

  const sendVerificationCode = async (): Promise<boolean> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 секунд күту

    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          city: formData.city,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()
      
      if (response.ok) {
        setVerificationSent(true)
        setError("")
        return true
      }

      if (data?.error) {
        setError(data.error)
      }
      return false
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("[v0] Error sending verification:", error)
      if (error instanceof Error && error.name === 'AbortError') {
        setError("Сервер жауап бермеді (Time out). Қайта көріңіз.")
      } else {
        setError("Код жіберу сәтсіз аяқталды. Интернетті тексеріңіз.")
      }
      return false
    }
  }

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First, verify the code
      const verifyResponse = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
        }),
      })

      let verifyData
      try {
        verifyData = await verifyResponse.json()
      } catch (e) {
        throw new Error(`Сервер қатесі (Verify): ${verifyResponse.status}`)
      }

      if (!verifyResponse.ok) {
        setError(verifyData.error || "Растау коды дұрыс емес")
        return
      }

      // Code verified, now register the user
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          city: formData.city,
          address: formData.address,
        }),
      })

      let registerData
      try {
        registerData = await registerResponse.json()
      } catch (e) {
        throw new Error(`Сервер қатесі (Register): ${registerResponse.status}`)
      }

      if (registerResponse.ok && registerData.success) {
        // Registration successful, now sign the user in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          // Handle sign-in error, e.g., show a message and prompt user to log in manually
          setError(`Тіркелу сәтті, бірақ автоматты кіруде қате пайда болды. Логин бетіне өтіп, қайталап көріңіз. (${signInError.message})`)
        } else {
          // Sign-in successful, redirect to profile
          router.push("/profile")
          router.refresh() // Refresh the page to update server components with the new session
        }
      } else {
        setError(registerData.error || t("genericError"))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t("genericError")
      
      // Check if it's a duplicate user error
      if (typeof message === "string" && message.includes("user_already_exists")) {
        setError("Бұл email-мен тіркелген пайдаланушы бар. Лауазымға кіріңіз.")
        return
      }
      
      if (typeof message === "string" && message.includes("Email-ды растаңыз")) {
        setEmailConfirmationRequired(true)
        setError("")
        return
      }
      setError(message || t("genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/login" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-semibold text-lg">{t("registerTitle")}</h1>
        </div>
      </header>

      <div className="px-4 py-8 max-w-md mx-auto">
        {/* Title */}
        {emailConfirmationRequired ? (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Email-ды растаңыз</h2>
            <p className="text-sm text-muted-foreground">
              Біз сіздің email-ға растау сілтемесін жібердік. Inbox/Spam бөлімін тексеріп, растағаннан кейін аккаунтқа кіріңіз.
            </p>
          </div>
        ) : (
        <div className="text-center mb-8">
          {step === 1 && (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("welcome")}</h2>
            </>
          )}
          <h3 className="text-xl font-semibold mb-2">
            {step}-{t("next").toLowerCase()}
          </h3>
          <p className="text-sm text-muted-foreground">{t("createAccount")}</p>
        </div>
        )}

        {/* Progress Bar */}
        {!emailConfirmationRequired && (
          <div className="flex gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full transition ${step >= 1 ? "bg-accent" : "bg-muted"}`} />
            <div className={`h-1 flex-1 rounded-full transition ${step >= 2 ? "bg-accent" : "bg-muted"}`} />
            <div className={`h-1 flex-1 rounded-full transition ${step >= 3 ? "bg-accent" : "bg-muted"}`} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("fullName")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("nameHint")}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t("emailAddress")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("emailHint")}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t("phone")}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("phoneHint")}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t("passwordCreate")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("passwordHint")}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20"
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
              <label className="text-sm font-medium mb-2 block">{t("confirmPassword")}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("passwordHint")}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20"
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {t("next")}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">
                {t("login")}
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("city")}</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
                required
              >
                <option value="">{t("selectCity")}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t("address")}</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t("addressHint")}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Жіберілуде..." : t("next")}
            </button>
          </form>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("verifyEmail")}</label>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder={t("enterCode")}
                maxLength={6}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {t("next")}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Код келмеді?{" "}
              <button
                type="button"
                onClick={async () => {
                  if (resendCooldown > 0 || isLoading) return
                  setIsLoading(true)
                  const sent = await sendVerificationCode()
                  setIsLoading(false)
                  if (sent) setResendCooldown(60)
                }}
                disabled={resendCooldown > 0 || isLoading}
                className={`font-semibold hover:underline ${resendCooldown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-accent"}`}
              >
                {resendCooldown > 0 ? `Қайта жіберу (${resendCooldown}с)` : "Қайта жіберу"}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
