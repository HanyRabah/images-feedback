// src/components/FeedbackModal.tsx
'use client'

import { useState } from 'react'
import type { Image, Feedback, User } from '@prisma/client'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

type FeedbackWithUser = Feedback & {
  user: Pick<User, 'name' | 'email'>
}

type ImageWithFeedback = Image & {
  feedback: FeedbackWithUser[]
}

interface FeedbackModalProps {
  image: ImageWithFeedback
  onClose: () => void
  onSubmit: () => void
}

export function FeedbackModal({ image, onClose, onSubmit }: FeedbackModalProps) {
  const { data: session } = useSession()
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/images/${image.id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      })

      if (!response.ok) throw new Error('Failed to submit feedback')

      toast.success('Feedback submitted successfully')
      setComment('')
      onSubmit()
    } catch (error) {
      toast.error('Failed to submit feedback')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return
  
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'DELETE',
      })
  
      if (!response.ok) throw new Error('Failed to delete feedback')
  
      toast.success('Feedback deleted successfully')
      onSubmit()
    } catch (error) {
      toast.error('Failed to delete feedback')
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Image Feedback</h2>

        {/* Existing Feedback */}
        <div className="mb-6 space-y-4">
          {image.feedback?.length > 0 ? (
            image.feedback.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.user?.name || item.user?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {(session?.user?.role === 'ADMIN' || 
                   session?.user?.id === item.userId) && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{item.comment}</p>
              </div>
            ))
          ) : (
           <></>
          )}
        </div>

        {/* Add New Feedback Form */}
        <form onSubmit={handleSubmit} className={`space-y-4 ${image.feedback?.length > 0 && 'border-t'} pt-4`}>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Add New Feedback
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-2 min-h-[100px]"
              required
              placeholder="Enter your feedback here..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}