import Hero from "@/components/hero"
import Services from "@/components/services"
import About from "@/components/about"
import Testimonials from "@/components/testimonials"
import ContactPopup from "@/components/contact-popup"
import Footer from "@/components/footer"
import Header from "@/components/header"
import AnnouncementsBanner from "@/components/announcements-banner"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AnnouncementsBanner />
        </div>
      </div>
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Footer />
      <ContactPopup />
    </div>
  )
}
