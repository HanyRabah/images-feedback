// src/components/Carousel.tsx
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface CarouselProps {
  images: { id: string; url: string; filename: string }[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  children?: React.ReactNode
}

export function Carousel({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  children
}: CarouselProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-50 hover:bg-white/10 p-2 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-2 rounded-full z-50"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 p-2 rounded-full z-50"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Current Image */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].filename}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Sidebar with Controls */}
      <div className="w-96 bg-white h-full overflow-y-auto flex flex-col">
        <div className="p-6 flex-1">
          {children}
        </div>

        {/* Thumbnails */}
        <div className="p-4 border-t">
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  if (index < currentIndex) onPrev()
                  if (index > currentIndex) onNext()
                }}
                className={cn(
                  "relative aspect-square",
                  currentIndex === index && "ring-2 ring-blue-500"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.filename}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}