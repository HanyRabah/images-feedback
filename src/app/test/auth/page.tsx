// src/app/test/auth/page.tsx
'use client'

import { useState } from 'react'

export default function TestAuth() {
  const [result, setResult] = useState<{ email?: string; password?: string; error?: string } | null>(null)

  const testAuth = async () => {
    try {
      const response = await fetch('/api/test/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin1234'
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    }
  }

  return (
    <div className="p-4">
      <button
        onClick={testAuth}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Auth
      </button>
      
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}