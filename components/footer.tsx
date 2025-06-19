"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useContactPopup } from "@/hooks/use-contact-popup"
import Image from "next/image"
import { useState } from "react"

export default function Footer() {
  const { openPopup } = useContactPopup()
  const [logoIdx, setLogoIdx] = useState(0)
  const logoPaths = [
    "/images/logo.png",
    "/images/logo.jpg",
    "/images/logo.jpeg",
    "/images/logo.webp",
    "/images/logo.svg"
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={logoPaths[logoIdx]}
                alt="Logo"
                width={44}
                height={44}
                className="rounded-full border-4 border-yellow-400 shadow-lg bg-white object-cover"
                onError={() => setLogoIdx(idx => (idx + 1) % logoPaths.length)}
                priority
              />
              <span className="text-base font-bold text-gray-900">Global Servicex</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Empowering businesses with innovative digital solutions and strategic growth consulting.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/globalservices369?utm_source=ig_web_button_share_sheet&igsh=MWt6ejJwYjVydTRp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </a>
              <a href="https://x.com/globalservicex" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </a>
              <a href="https://www.linkedin.com/company/globalservicescrm" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Our Services</h3>
            <ul className="space-y-1 text-gray-400 text-xs sm:text-sm">
              <li><a href="#web-development" className="hover:text-yellow-500 transition-colors">Web Development</a></li>
              <li><a href="#app-development" className="hover:text-yellow-500 transition-colors">App Development</a></li>
              <li><a href="#branding" className="hover:text-yellow-500 transition-colors">Branding & Design</a></li>
              <li><a href="#marketing" className="hover:text-yellow-500 transition-colors">Digital Marketing</a></li>
              <li><a href="#consulting" className="hover:text-yellow-500 transition-colors">Growth Consulting</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="space-y-1 text-gray-400 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-yellow-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-yellow-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-yellow-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-yellow-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <button onClick={openPopup} className="hover:text-yellow-500 transition-colors text-left">
                  Contact
                </button>
              </li>
              <li>
                <Link href="#" className="hover:text-yellow-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Contact Info</h3>
            <div className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://wa.me/917248316506"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 underline"
                  title="Chat on WhatsApp"
                >
                  +91 7248316506
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=globalservicex369@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 underline"
                  title="Send Email via Gmail"
                >
                  globalservicex369@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Dehradun Road, 247667, Uttarakhand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter - Mobile Optimized */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-base font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white flex-1 h-9 sm:h-11 text-xs sm:text-base"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black h-9 sm:h-11 px-4 sm:px-6 text-xs sm:text-base">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-3 sm:pt-6 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Global Servicex. All rights reserved.</p>
          <p>
            <a href="https://www.globalservicex.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 underline">Website by Global Servicex</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
