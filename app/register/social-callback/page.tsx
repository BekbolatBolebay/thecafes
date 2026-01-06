"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "@/components/theme-language-toggle"

export default function SocialCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processSocialLogin = async () => {
      try {
        const code = searchParams?.get("code")
        const state = searchParams?.get("state")
        const provider = searchParams?.get("provider") || "google"

        if (!code) {
          setError("Authorization code not provided")
          setIsProcessing(false)
          return
        }

        // Exchange authorization code for tokens and user info
        const response = await fetch(`/api/auth/${provider}/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Social login failed")
          setIsProcessing(false)
          return
        }

        // Store user data from social login
        sessionStorage.setItem("socialLoginData", JSON.stringify({
          name: data.name,
          email: data.email,
          provider: provider,
        }))

        // Redirect back to register page with social login flag
        router.push("/register?social=true&step=2")
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setIsProcessing(false)
      }
    }

    processSocialLogin()
  }, [searchParams, router])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold mb-2 text-red-600">{t("genericError")}</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
          >
            {t("register")}
          </button>
        </div>
      </div>
    )
  }

  return null
}
