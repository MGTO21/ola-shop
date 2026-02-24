'use client'
import React, { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

export default function QuizModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-4 left-4 z-50 bg-rose-500 text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-2 hover:bg-rose-600 transition-all hover:scale-105">
        <Sparkles className="w-4 h-4" /> Find Your Scent
      </button>
    )
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl animate-fade-in-up">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        <div className="text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="w-6 h-6 text-rose-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Scent Finder</h3>
            <p className="text-gray-500 text-sm mb-6">Answer quick questions to find your signature Sudani fragrance.</p>
            {step === 0 && (
                <div className="space-y-3">
                    <button onClick={() => setStep(1)} className="w-full py-3 bg-gray-50 hover:bg-rose-50 border border-gray-100 rounded-xl">I love Floral 🌸</button>
                    <button onClick={() => setStep(1)} className="w-full py-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl">I love Woody/Oud 🪵</button>
                </div>
            )}
            {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                    <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                    <button onClick={() => alert("We'll email you your perfect match!")} className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl shadow-lg">Reveal My Match</button>
                    <button onClick={() => setStep(0)} className="text-xs text-gray-400 underline">Back</button>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
