"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Eye, Award, Users, Clock, Globe } from "lucide-react"
import { useContactPopup } from "@/hooks/use-contact-popup"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"

const stats = [
  { icon: Users, label: "Happy Clients", value: "500+" },
  { icon: Award, label: "Projects Completed", value: "1000+" },
  { icon: Clock, label: "Years Experience", value: "5+" },
  { icon: Globe, label: "Countries Served", value: "15+" },
]

const aboutImages = [
  { src: "/images/team.png", alt: "Team", title: "Our Team", desc: "A passionate team driving your success" },
  { src: "/images/branding.png", alt: "Branding", title: "Branding", desc: "Building memorable brands for growth" },
  { src: "/images/marketing.png", alt: "Marketing", title: "Marketing", desc: "Innovative marketing for digital impact" },
]

export default function About() {
  const { openPopup } = useContactPopup()
  const [customers, setCustomers] = useState(500)
  const [deliveries, setDeliveries] = useState(1000)
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const customerInterval = setInterval(() => setCustomers((c) => c + Math.floor(Math.random() * 3)), 2000)
    const deliveryInterval = setInterval(() => setDeliveries((d) => d + Math.floor(Math.random() * 5)), 2500)
    const imageInterval = setInterval(() => setImgIdx((idx) => (idx + 1) % aboutImages.length), 2000)
    return () => {
      clearInterval(customerInterval)
      clearInterval(deliveryInterval)
      clearInterval(imageInterval)
    }
  }, [])

  return (
    <section id="about" className="py-10 sm:py-14 bg-[#fafbfc] relative overflow-hidden">
      {/* Floating Circles for 2D effect */}
      <div className="absolute top-10 left-1/3 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-300 rounded-full opacity-60 blur-2xl z-0" />
      <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-40 sm:h-40 bg-blue-200 rounded-full opacity-40 blur-2xl z-0" />
      <div className="absolute top-0 right-0 w-28 h-28 sm:w-40 sm:h-40 bg-yellow-100 rounded-full opacity-40 blur-2xl z-0" />
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Title & Subtitle */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">Transforming Ideas into Digital Reality</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            We are a team of passionate developers, designers, and digital strategists dedicated to helping businesses thrive in the digital world. Learn more about <Link href="/" className="text-yellow-600 underline font-semibold">Global Servicex</Link>.
          </p>
        </div>
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16">
          {/* Left: Image with overlay */}
          <div className="relative w-full max-w-xl lg:w-1/2 rounded-3xl overflow-hidden shadow-xl bg-white mb-6 lg:mb-0">
            <Image
              src={aboutImages[imgIdx].src}
              alt={aboutImages[imgIdx].alt}
              width={700}
              height={400}
              className="object-cover w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-[340px] lg:h-[400px] transition-all duration-700"
              priority
            />
            {/* Overlay text */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
              <h3 className="text-white text-lg sm:text-2xl font-bold mb-1">{aboutImages[imgIdx].title}</h3>
              <p className="text-white text-xs sm:text-base">{aboutImages[imgIdx].desc}</p>
            </div>
            {/* Floating circle */}
            <div className="absolute -top-8 -right-8 w-14 h-14 sm:w-24 sm:h-24 bg-yellow-300 rounded-full opacity-90 z-10" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 sm:w-20 sm:h-20 bg-blue-300 rounded-full opacity-60 z-10" />
          </div>
          {/* Right: Stats grid */}
          <div className="flex-1 w-full lg:w-1/2 flex flex-col gap-4 sm:gap-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-white rounded-2xl shadow-md flex items-center gap-3 sm:gap-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-200 p-2 sm:p-3 rounded-xl">
                  <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">500</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Happy Clients</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md flex items-center gap-3 sm:gap-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-orange-400 to-yellow-200 p-2 sm:p-3 rounded-xl">
                  <Award className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">1000</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Projects Completed</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md flex items-center gap-3 sm:gap-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-200 p-2 sm:p-3 rounded-xl">
                  <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">10+</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Years Experience</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md flex items-center gap-3 sm:gap-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-orange-400 to-yellow-200 p-2 sm:p-3 rounded-xl">
                  <Globe className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">25</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Countries Served</div>
                </div>
              </div>
            </div>
            {/* Info blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4">
              <div>
                <div className="font-bold text-base sm:text-lg text-gray-900 mb-1">{aboutImages[imgIdx].title}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{aboutImages[imgIdx].desc}</div>
              </div>
              <div>
                <div className="font-bold text-base sm:text-lg text-gray-900 mb-1">{aboutImages[(imgIdx+1)%3].title}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{aboutImages[(imgIdx+1)%3].desc}</div>
              </div>
              <div>
                <div className="font-bold text-base sm:text-lg text-gray-900 mb-1">{aboutImages[(imgIdx+2)%3].title}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{aboutImages[(imgIdx+2)%3].desc}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
