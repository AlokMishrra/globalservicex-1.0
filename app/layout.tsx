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
  title: "Global Servicex | Best Software Company in Roorkee, Uttarakhand | App Development & Web Solutions",
  description: "Global Servicex is the #1 software company in Roorkee, Uttarakhand. We provide best app development, web development, AI solutions, and software services in India. Trusted by 500+ clients with 4.9/5 rating.",
  keywords: [
    "Global Servicex",
    "Global Services",
    "software company Roorkee",
    "software company Uttarakhand",
    "best software company India",
    "app development Roorkee",
    "web development Uttarakhand",
    "software development company",
    "mobile app development",
    "website development",
    "AI solutions",
    "automation services",
    "digital marketing",
    "freelance platform",
    "tech company Roorkee",
    "IT services Uttarakhand",
    "software solutions",
    "custom software development",
    "e-commerce development",
    "business automation",
    "cloud solutions",
    "data analytics",
    "machine learning",
    "artificial intelligence",
    "blockchain development",
    "cybersecurity services",
    "Alok Mishra",
    "globalservicex.in",
    "top software company",
    "best tech company",
    "leading software firm",
    "premium software services",
    "innovative technology solutions",
    "reliable software partner",
    "professional development team",
    "award winning software company",
    "trusted technology partner",
    "expert software developers",
    "quality software solutions",
    "affordable software services",
    "fastest growing tech company",
    "cutting edge technology",
    "modern software development",
    "scalable software solutions",
    "enterprise software development",
    "startup software solutions",
    "SME software services",
    "corporate software development"
  ],
  authors: [{ name: "Alok Mishra", url: "https://globalservicex.in" }],
  creator: "Alok Mishra - Global Servicex",
  publisher: "Global Servicex",
  robots: { 
    index: true, 
    follow: true, 
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  generator: "Next.js",
  applicationName: "Global Servicex",
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://globalservicex.in",
    siteName: "Global Servicex",
    title: "Global Servicex | Best Software Company in Roorkee, Uttarakhand | App Development & Web Solutions",
    description: "Global Servicex is the #1 software company in Roorkee, Uttarakhand. We provide best app development, web development, AI solutions, and software services in India. Trusted by 500+ clients with 4.9/5 rating.",
    images: [
      {
        url: "https://globalservicex.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global Servicex - Best Software Company in Roorkee, Uttarakhand",
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@globalservicex",
    creator: "@alokmishra_gs",
    title: "Global Servicex | Best Software Company in Roorkee, Uttarakhand",
    description: "Global Servicex is the #1 software company in Roorkee, Uttarakhand. We provide best app development, web development, AI solutions, and software services in India.",
    images: ["https://globalservicex.in/og-image.jpg"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "any", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#fbbf24" }
    ]
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://globalservicex.in/",
    languages: {
      'en-IN': 'https://globalservicex.in/',
      'en-US': 'https://globalservicex.in/'
    }
  },
  category: "Technology",
  classification: "Software Development Company",
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Global Servicex",
      "alternateName": "Global Services",
      "url": "https://globalservicex.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://globalservicex.in/logo.jpg",
        "width": 300,
        "height": 300
      },
      "image": "https://globalservicex.in/og-image.jpg",
      "description": "Global Servicex is the leading software development company in Roorkee, Uttarakhand, India. We specialize in app development, web development, AI solutions, automation services, and digital marketing. Trusted by 500+ clients with 4.9/5 rating.",
      "foundingDate": "2020",
      "founder": {
        "@type": "Person",
        "name": "Alok Mishra",
        "jobTitle": "Founder & CEO",
        "url": "https://globalservicex.in/alok-mishra-founder"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Roorkee",
        "addressLocality": "Roorkee",
        "addressRegion": "Uttarakhand",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      "sameAs": [
        "https://www.instagram.com/globalservices369",
        "https://www.linkedin.com/in/alokmishra-globalservices",
        "https://www.facebook.com/globalservicex",
        "https://twitter.com/globalservicex"
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 29.8668,
          "longitude": 77.8781
        },
        "geoRadius": "1000000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Software Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mobile App Development",
              "description": "iOS and Android app development services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Development",
              "description": "Custom website and web application development"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Solutions",
              "description": "Artificial Intelligence and Machine Learning solutions"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Automation Services",
              "description": "Business process automation and workflow optimization"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "knowsAbout": [
        "Software Development",
        "Mobile App Development",
        "Web Development",
        "Artificial Intelligence",
        "Machine Learning",
        "Automation",
        "Digital Marketing",
        "E-commerce Development",
        "Cloud Solutions",
        "Data Analytics"
      ]
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" sizes="any" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#fbbf24" />
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
