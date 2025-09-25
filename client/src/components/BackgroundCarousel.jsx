"use client"

import { useState, useEffect } from "react"

const BackgroundCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const chipImages = [
    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=1200&h=800&fit=crop&crop=center&q=80", // Golden potato chips
    "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=1200&h=800&fit=crop&crop=center&q=80", // Colorful chips variety
    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=1200&h=800&fit=crop&crop=center&q=80", // Tortilla chips with dips
    "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=1200&h=800&fit=crop&crop=center&q=80", // Premium artisan chips
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % chipImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [chipImages.length])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {chipImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-60" : "opacity-0"
          }`}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={`Chips background ${index + 1}`}
            className="w-full h-full object-cover object-center"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-indigo-900/30 to-purple-900/40"></div>
        </div>
      ))}

      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
        {chipImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 shadow-lg ${
              index === currentSlide
                ? "bg-indigo-500 border-indigo-500 scale-110 shadow-indigo-500/50"
                : "bg-white/60 border-white/80 hover:bg-white/90 hover:border-white hover:scale-105"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default BackgroundCarousel
