import Hero from "@/components/hero"
import Services from "@/components/services"
import About from "@/components/about"
import Testimonials from "@/components/testimonials"
import ContactPopup from "@/components/contact-popup"
import Footer from "@/components/footer"
import Header from "@/components/header"
import AnnouncementsBanner from "@/components/announcements-banner"

export const metadata = {
  title: "Global Servicex | Best Software Company in Roorkee, Uttarakhand | App Development & Web Solutions",
  description: "Global Servicex is the #1 software company in Roorkee, Uttarakhand. We provide best app development, web development, AI solutions, and software services in India. Trusted by 500+ clients with 4.9/5 rating.",
  keywords: [
    "Global Servicex",
    "software company Roorkee",
    "software company Uttarakhand", 
    "best software company India",
    "app development Roorkee",
    "web development Uttarakhand",
    "mobile app development",
    "website development",
    "AI solutions",
    "automation services",
    "digital marketing",
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
  openGraph: {
    title: "Global Servicex | Best Software Company in Roorkee, Uttarakhand",
    description: "Global Servicex is the #1 software company in Roorkee, Uttarakhand. We provide best app development, web development, AI solutions, and software services in India.",
    url: "https://globalservicex.in",
    siteName: "Global Servicex",
    images: [
      {
        url: "https://globalservicex.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global Servicex - Best Software Company in Roorkee, Uttarakhand",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Servicex | Best Software Company in Roorkee, Uttarakhand",
    description: "Global Servicex is the #1 software company in Roorkee, Uttarakhand. We provide best app development, web development, AI solutions, and software services in India.",
    images: ["https://globalservicex.in/og-image.jpg"],
  },
  alternates: {
    canonical: "https://globalservicex.in/",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AnnouncementsBanner />
        </div>
      </div>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center hidden">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Welcome to Global Servicex – India's Fastest Growing Tech & Freelance Platform
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          Global Servicex empowers businesses with innovative digital solutions, including web development, app development, digital marketing, and growth consulting. Join thousands of satisfied clients who trust Global Servicex for their technology and business growth needs.
        </p>
      </section>
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Footer />
      <ContactPopup />
    </div>
  )
}
