"use client"

import { useCareerPopup } from "@/hooks/use-career-popup"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CareerPopup() {
  const { isOpen, closePopup } = useCareerPopup()
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 pt-16">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 flex flex-col gap-4 border-t-4 border-yellow-400 animate-fade-in-down">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Careers</h3>
        <Button onClick={() => { closePopup(); router.push('/careers/team'); }} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Join Team</Button>
        <Button onClick={() => { closePopup(); router.push('/careers/internship'); }} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">Apply for Internship</Button>
        <button onClick={closePopup} className="text-gray-500 hover:text-red-500 text-sm mt-2">Cancel</button>
      </div>
    </div>
  )
} 