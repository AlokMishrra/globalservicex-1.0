"use client"

import { useCareerPopup } from "@/hooks/use-career-popup"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

export default function CareerPopup() {
  const { isOpen, closePopup } = useCareerPopup()
  const router = useRouter()
  const [showVerify, setShowVerify] = useState(false)
  const [iframeHeight, setIframeHeight] = useState('70vh')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (!showVerify) return;
    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://globalcertificate.vercel.app') return;
      if (event.data && event.data.type === 'resize' && event.data.height) {
        setIframeHeight(event.data.height + 'px');
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showVerify]);

  const handleCloseVerify = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowVerify(false);
      setIsClosing(false);
    }, 700); // match .animate-popup-fade-out duration
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 pt-16">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 flex flex-col gap-4 border-t-4 border-yellow-400 animate-fade-in-down">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Careers</h3>
        <Button onClick={() => { closePopup(); router.push('/careers/team'); }} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Join Team</Button>
        <Button onClick={() => { closePopup(); router.push('/careers/internship'); }} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">Apply for Internship</Button>
        <Button onClick={() => setShowVerify(true)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">Verify Certificate</Button>
        <button onClick={closePopup} className="text-gray-500 hover:text-red-500 text-sm mt-2">Cancel</button>
      </div>
      {(showVerify || isClosing) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80">
          <div className={`bg-white w-screen h-screen max-w-none max-h-none flex flex-col border-0 relative rounded-none p-0 transition-transform transition-opacity duration-700 ease-out ${isClosing ? 'animate-popup-fade-out' : 'animate-popup-fade-in'}` }>
            <button onClick={handleCloseVerify} className="absolute top-4 right-6 text-gray-500 hover:text-red-500 text-3xl font-bold z-10 bg-white bg-opacity-80 rounded-full px-3 py-1 shadow-lg">&times;</button>
            <iframe
              ref={iframeRef}
              src="https://globalcertificate.vercel.app/"
              title="Verify Certificate"
              className="w-full h-full border-0 flex-1"
              style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh', transition: 'none' }}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
} 