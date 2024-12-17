// src/app/admin/upload/[clientId]/UploadClient.tsx
'use client'

import { useState } from 'react'
import { ImageDropzone } from '@/components/ImageDropzone'
import { ImageGrid } from '@/components/ImageGrid'
import type { User, Folder, Image } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type ClientWithFolders = User & {
  folders: (Folder & {
    images: Image[]
  })[]
}

export default function UploadClient({ client }: { client: ClientWithFolders }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(client.folders[0]?.id || '')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [showCreateFolder, setShowCreateFolder] = useState(false)

  const handleUploadComplete = () => {
    router.refresh()
  }

  const handleCreateFolder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    
    fetch('/api/admin/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        clientId: selectedClientId,
      }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Server error:', errorData)
        throw new Error(errorData.error || 'Failed to create folder')
      }
      return res.json()
    })
    .then((data) => {
      console.log('Success:', data)
      toast.success('Folder created successfully')
      setShowCreateFolder(false)
      router.refresh()
    })
    .catch((error) => {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to create folder')
    })
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Upload Images for {client.name || client.email}
      </h1>
      
      <button
            onClick={() => {
            setSelectedClientId(client.id)
            setShowCreateFolder(true)
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            Create Project
        </button>
        
      <div className="mb-8">
      {client.folders.length > 0 ? (
        <div>
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {client.folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveTab(folder.id)}
                  className={cn(
                    'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
                    activeTab === folder.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {folder.name}
                  <span
                    className={cn(
                      'ml-2 py-0.5 px-2.5 rounded-full text-xs',
                      activeTab === folder.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    {folder.images.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {client.folders.map((folder) => (
              <div
                key={folder.id}
                className={cn(
                  'space-y-6',
                  activeTab === folder.id ? 'block' : 'hidden'
                )}
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ImageDropzone
                    folderId={folder.id}
                    onUploadComplete={handleUploadComplete}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    clientId={client.id}
                  />
                </div>

                <div className="bg-white rounded-lg shadow">
                  <ImageGrid
                    images={folder.images}
                    client={client}
                    onStatusUpdate={handleUploadComplete}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
          No projects found. Please create a project first.
        </p>
      )}
      </div>
        {/* Create Folder Modal */}
        {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFolder(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}