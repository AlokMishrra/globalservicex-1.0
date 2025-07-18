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
  title: "Global Services | India's Fastest Growing Tech & Freelance Platform",
  description: "Global Services is India's trusted platform for software, app, and automation solutions. Connect with top freelancers and developers today.",
  keywords: [
    "Global Services",
    "Global Services India",
    "software company",
    "app development",
    "automation",
    "AI",
    "freelancing",
    "globalservicex",
    "Alok Mishra"
  ],
  authors: [{ name: "Alok Mishra" }],
  robots: { index: true, follow: true },
  generator: "v0.dev",
  openGraph: {
    title: "Global Services | Software & Freelance Solutions",
    description: "India's most innovative tech platform. Join the freelance revolution.",
    url: "https://globalservicex.in",
    images: [
      {
        url: "https://globalservicex.in/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Global Services Logo"
      }
    ]
  },
  icons: {
    icon: "/favicon.png"
  },
  alternates: {
    canonical: "https://globalservicex.in/"
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Global Services",
      "url": "https://globalservicex.in",
      "logo": "https://globalservicex.in/logo.jpg",
      "sameAs": [
        "https://www.instagram.com/globalservices369",
        "https://www.linkedin.com/in/alokmishra-globalservices"
      ],
      "founder": {
        "@type": "Person",
        "name": "Alok Mishra"
      },
      "description": "India's trusted technology and freelancing platform for app, web, and automation solutions."
    })
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
