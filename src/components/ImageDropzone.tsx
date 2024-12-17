// src/components/ImageDropzone.tsx
'use client'

import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface ImageDropzoneProps {
  folderId: string
  onUploadComplete: () => void
  isUploading: boolean
  setIsUploading: (value: boolean) => void
  clientId: string
}

export function ImageDropzone({ 
  folderId, 
  onUploadComplete,
  isUploading,
  setIsUploading
}: ImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: async (acceptedFiles) => {
      setIsUploading(true)
      
      try {
        for (const file of acceptedFiles) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('folderId', folderId)

          const response = await fetch(`/api/admin/upload/`, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('Upload failed')
          }
        }
        
        toast.success('Images uploaded successfully')
        onUploadComplete()
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Failed to upload images')
      } finally {
        setIsUploading(false)
      }
    }
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p className="text-gray-500">Uploading...</p>
      ) : isDragActive ? (
        <p className="text-blue-500">Drop the files here...</p>
      ) : (
        <p className="text-gray-500">Drag & drop images here, or click to select files</p>
      )}
    </div>
  )
}