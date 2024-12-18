'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminDashboardClient({ initialClients = [] }) {
  const [showCreateClient, setShowCreateClient] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    fetch('/api/admin/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
      }),
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to create client')
      toast.success('Client created successfully')
      setShowCreateClient(false)
      router.refresh()
    })
    .catch(() => {
      toast.error('Failed to create client')
    })
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This will delete all their folders and images.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/clients`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete client')
      }

      toast.success('Client deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete client')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients List</h1>
        <button
          onClick={() => setShowCreateClient(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Client
        </button>
      </div>
      
      <div className="grid gap-4">
        {initialClients.map((client) => (
          <div key={client.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{client.name || client.email}</h2>
                <p className="text-gray-600">Projects: {client.folders.length}</p>
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/admin/upload/${client.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit Client
                </Link>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {initialClients.length === 0 && (
          <p className="text-gray-600 text-center py-8">
            No projects yet. Create your first project to get started.
          </p>
        )}
      </div>

      {/* Create Client Modal */}
      {showCreateClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Client</h2>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateClient(false)}
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