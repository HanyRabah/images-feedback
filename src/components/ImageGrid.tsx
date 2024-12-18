'use client'
import Image from 'next/image'
import { FeedbackModal } from './FeedbackModal'
import type { Image as ImageType, User } from '@prisma/client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Carousel } from '@/components/Carousel'


export function ImageGrid({ images, client, onStatusUpdate }: {
  images: ImageType[] 
  client?: User
  onStatusUpdate: () => void
}) {
  const { data: session } = useSession()
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete image')
      toast.success('Image deleted successfully')
      onStatusUpdate()
    } catch (error) {
      toast.error('Failed to delete image')
      console.error(error)
    }
  }

  const isAdmin = session?.user?.role === 'ADMIN'

  const openCarousel = (index: number) => {
    setCurrentImageIndex(index)
    setIsCarouselOpen(true)
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="relative aspect-square cursor-pointer group"
            onClick={() => openCarousel(index)}
          >
            <Image
              src={image.url}
              alt={image.filename}
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
            
            <div className="absolute bottom-2 left-2">
              <div className={`text-xs font-semibold px-2 py-1 rounded-full
                ${image.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                  image.status === 'PASSED' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {image.status === 'PASSED' ? 'Not Approved' : image.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Modal */}
      {isCarouselOpen && (
        <Carousel
        images={images}
        currentIndex={currentImageIndex}
        onClose={() => setIsCarouselOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      >
        <div className="space-y-6">
          {/* Status and Delete */}
          <div className="flex items-center justify-between">
            <div className={`text-sm font-semibold px-3 py-1 rounded-full
              ${images[currentImageIndex].status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                images[currentImageIndex].status === 'PASSED' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {images[currentImageIndex].status === 'PASSED' ? 'Not Approved' : images[currentImageIndex].status}
            </div>
            
            {isAdmin && (
              <button
                onClick={() => handleDeleteImage(images[currentImageIndex].id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>
      
          {/* Image Info */}
          <div className="text-sm text-gray-600">
            <p>Filename: {images[currentImageIndex].filename}</p>
            {/* <p>Uploaded: {new Date(images[currentImageIndex].createdAt).toLocaleString()}</p> */}
          </div>
      
          {/* Controls */}
          {isAdmin ? (
            <button
              onClick={() => setShowFeedback(images[currentImageIndex].id)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Feedback ({images[currentImageIndex].feedback?.length || 0})
            </button>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedImage(images[currentImageIndex])}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Feedback
              </button>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await fetch(`/api/images/${images[currentImageIndex].id}/status`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'APPROVED' }),
                    })
                    onStatusUpdate()
                  }}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-200"
                  disabled={images[currentImageIndex].status === 'APPROVED'}
                >
                  Approve
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/images/${images[currentImageIndex].id}/status`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'PASSED' }),
                    })
                    onStatusUpdate()
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-200"
                  disabled={images[currentImageIndex].status === 'PASSED'}
                >
                  Not Approved
                </button>
              </div>
            </div>
          )}
        </div>
      </Carousel>
      )}

      {/* Feedback Modal */}
      {selectedImage && (
        <FeedbackModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onSubmit={() => {
            setSelectedImage(null)
            onStatusUpdate()
          }}
        />
      )}

      {/* Feedback View Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Image Feedback</h2>
            {images.find(img => img.id === showFeedback)?.feedback?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No feedback yet</p>
            ) : (
              images.find(img => img.id === showFeedback)?.feedback?.map((feedback) => (
                <div key={feedback.id} className="border-b py-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">
                      {client?.name || client?.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-gray-600">{feedback.comment}</p>
                </div>
              ))
            )}
            <button
              onClick={() => setShowFeedback(null)}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}