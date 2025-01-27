'use client'

import { ImageGrid } from '@/components/ImageGrid'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  // Sync hash from URL with tabs
  useEffect(() => {
    if (folders.length === 0) return

    // Get hash from the URL
    const hash = window.location.hash.slice(1)
    const validFolder = folders.find(folder => 
      folder.name.toLowerCase().replace(/\s+/g, '-') === hash
    )

    if (validFolder) {
      setActiveTab(hash) // Set the tab based on the hash
    } else {
      const defaultTab = folders[0].name.toLowerCase().replace(/\s+/g, '-')
      setActiveTab(defaultTab)
      window.location.hash = defaultTab // Update URL with the default tab
    }
  }, [folders])

  // Handle tab change and update the URL hash
  const handleTabChange = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (folder) {
      const tabHash = folder.name.toLowerCase().replace(/\s+/g, '-')
      setActiveTab(tabHash)
      window.location.hash = tabHash // Update the URL hash
    }
  }

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
              {folders.map((folder) => {
                const tabHash = folder.name.toLowerCase().replace(/\s+/g, '-')
                return (
                  <button
                    key={folder.id}
                    onClick={() => handleTabChange(folder.id)}
                    className={cn(
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                      activeTab === tabHash
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {folder.name}
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-medium',
                          activeTab === tabHash
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {folder.images.length}
                      </span>
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {folders.map((folder) => {
              const tabHash = folder.name.toLowerCase().replace(/\s+/g, '-')
              return (
                <div
                  key={folder.id}
                  className={cn(
                    'transition-opacity duration-200',
                    activeTab === tabHash ? 'block' : 'hidden'
                  )}
                >
                  <ImageGrid 
                    images={folder.images}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </div>
              )
            })}
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
