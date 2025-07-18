import Hero from "@/components/hero"
import Services from "@/components/services"
import About from "@/components/about"
import Testimonials from "@/components/testimonials"
import ContactPopup from "@/components/contact-popup"
import Footer from "@/components/footer"
import Header from "@/components/header"
import AnnouncementsBanner from "@/components/announcements-banner"

export const metadata = {
  title: "Global Servicex - Home | India's Fastest Growing Tech & Freelance Platform",
  description: "Welcome to Global Servicex, India's leading platform for software, app, and automation solutions. Discover our services, testimonials, and more!",
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
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
