import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import dynamic from "next/dynamic"
import CareerPopup from "@/components/career-popup"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

const Chatbot = dynamic(() => import("@/components/chatbot"), { ssr: false })

export const metadata: Metadata = {
  title: "Global Servicex - Digital Solutions & Growth Consulting",
  description:
    "Empowering businesses with innovative digital solutions including web development, app development, digital marketing, and growth consulting services.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
        <Chatbot />
        <CareerPopup />
        <Analytics />
      </body>
    </html>
  )
}
