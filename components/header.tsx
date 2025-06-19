"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"
import { useContactPopup } from "@/hooks/use-contact-popup"
import Image from "next/image"
import { Pacifico } from 'next/font/google'
import { useRouter } from "next/navigation"
import { useCareerPopup } from "@/hooks/use-career-popup"

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' })

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openPopup } = useContactPopup()
  const { openPopup: openCareerPopup } = useCareerPopup()
  const [logoIdx, setLogoIdx] = useState(0)
  const logoPaths = [
    "/images/logo.png",
    "/images/logo.jpg",
    "/images/logo.jpeg",
    "/images/logo.webp",
    "/images/logo.svg"
  ]
  const router = useRouter()

  useEffect(() => {
    // Trigger animations on mount
    const tabs = document.querySelectorAll('.nav-anim');
    tabs.forEach((tab, i) => {
      tab.classList.add('animate-nav-' + i);
    });
  }, []);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-20 relative">
        <div className="flex-1 flex justify-center items-center">
          {/* Logo */}
          <button onClick={() => router.push('/')} className="flex items-center gap-2 group focus:outline-none">
            <span className="inline-block rounded-full bg-white border-4 border-yellow-400 shadow-lg p-1">
              <Image src={logoPaths[logoIdx]} alt="Global Servicex Logo" width={48} height={48} className="rounded-full bg-white" priority />
            </span>
            <span className={`text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-yellow-500 transition-colors ${pacifico.className}`}>Global Servicex</span>
          </button>
        </div>
        {/* Desktop Navigation */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center gap-2 sm:gap-4">
            <Link href="/#hero" className="nav-anim px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">Home</Link>
            <Link href="/#services" className="nav-anim px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">Services</Link>
            <Link href="/#about" className="nav-anim px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">About</Link>
            <Link href="/blog" className="nav-anim px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">Blog</Link>
            <Link href="#" onClick={e => { e.preventDefault(); openCareerPopup(); }} className="nav-anim px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors relative">Careers
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-400 text-white rounded-full font-bold animate-pulse absolute -top-2 -right-8">New</span>
            </Link>
          </nav>
        </div>
        {/* Contact button (desktop) */}
        <div className="hidden md:flex items-center justify-end flex-1">
          <Button onClick={openPopup} className="px-4 py-2 rounded-lg font-semibold bg-yellow-400 text-white hover:bg-yellow-500 transition-colors">Contact</Button>
        </div>
        {/* Contact button (mobile) */}
        <div className="md:hidden flex items-center absolute right-14 top-1/2 -translate-y-1/2">
          <Button onClick={openPopup} className="px-3 py-2 rounded-lg font-semibold bg-yellow-400 text-white hover:bg-yellow-500 transition-colors text-sm">Contact</Button>
        </div>
        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile Sidebar Navigation */}
      <div className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}></div>
      <aside className={`fixed top-0 right-0 z-50 w-72 max-w-full h-full bg-white shadow-lg transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 px-6 py-4">
          <Link href="/#hero" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">Home</Link>
          <Link href="/#services" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">Services</Link>
          <Link href="/#about" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">About</Link>
          <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors">Blog</Link>
          <Link href="#" onClick={e => { e.preventDefault(); openCareerPopup(); setIsMenuOpen(false); }} className="px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition-colors relative">Careers
            <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-400 text-white rounded-full font-bold animate-pulse absolute -top-2 -right-8">New</span>
          </Link>
        </nav>
      </aside>
    </header>
  )
}
