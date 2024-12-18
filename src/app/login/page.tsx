// src/app/login/page.tsx
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

  // Handle redirect based on user role
  useEffect(() => {
    if (session?.user?.role) {
      if (session.user.role === 'ADMIN') {
        router.push('/admin')
      } else if (session.user.role === 'CLIENT') {
        router.push('/client')
      }
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
  
    try {
      console.log('Attempting login with:', credentials.email); // Debug log
      
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        callbackUrl: '/'
      })
  
      console.log('Login result:', result); // Debug log
  
      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push(result?.url || '/')
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // If already authenticated, show loading state
  if (session) {
    return (
      <div className="container mx-auto p-6 max-w-md text-center">
        <div className="animate-pulse">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      
      {error && (
        <div className="mb-4 p-4 text-sm rounded bg-red-50 text-red-500">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({
              ...prev,
              email: e.target.value
            }))}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({
              ...prev,
              password: e.target.value
            }))}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}