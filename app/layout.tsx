import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminProvider } from "@/lib/admin-context"
import { AppProvider } from "@/lib/store"
import { AdminFooter } from "@/components/admin-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Food Delivery",
  description: "Order food online from your favorite restaurants",
}

import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kk">
      <body className={`font-sans antialiased`}>
        <AdminProvider>
          <AppProvider>
            {children}
            <AdminFooter />
            <Toaster />
          </AppProvider>
        </AdminProvider>
        <Analytics />
      </body>
    </html>
  )
}
