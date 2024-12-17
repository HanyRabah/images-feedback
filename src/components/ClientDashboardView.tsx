// src/app/client/ClientDashboardView.tsx
'use client'

import { ImageGrid } from '@/components/ImageGrid'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type Folder = {
  id: string
  name: string
  images: Array<{
    id: string
    url: string
    status: string
  }>
}

export default function ClientDashboardView({ 
  folders 
}: { 
  folders: Folder[] 
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('')

  // Set first tab as active by default
  useEffect(() => {
    if (folders.length > 0 && !activeTab) {
      setActiveTab(folders[0].id)
    }
  }, [folders, activeTab])

  const handleStatusUpdate = () => {
    router.refresh()
  }

  return (
    <div className="container mx-auto p-6">
      {folders.length > 0 ? (
        <div>
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Folders">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveTab(folder.id)}
                  className={cn(
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === folder.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {folder.name}
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        activeTab === folder.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {folder.images.length}
                    </span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={cn(
                  'transition-opacity duration-200',
                  activeTab === folder.id ? 'block' : 'hidden'
                )}
              >
                <ImageGrid 
                  images={folder.images}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">
          No images have been uploaded yet.
        </p>
      )}
    </div>
  )
}