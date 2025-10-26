'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const supabase = createClient()

  useEffect(() => {
    async function testConnection() {
      try {
        setConnectionStatus('🔄 Testing connection...')
        
        const { data, error: testError } = await supabase.from('test_connection').select('id').limit(1)
        
if (testError) {
  if (testError.code === 'PGRST204' || testError.message.includes('relation') || testError.message.includes('does not exist')) {
    setConnectionStatus('✅ Connected to Supabase! Database is ready.')
  } else if (testError.message.includes('schema cache')) {
    setConnectionStatus('⏳ Database is warming up. Refresh in a few seconds...')
  } else {
    setConnectionStatus(`❌ Error: ${testError.message}`)
  }
} else {
  // Success - no error!
  setConnectionStatus('✅ Connected to Supabase! Database is ready.')
}
      } catch (err: any) {
        console.error('Connection error:', err)
        setConnectionStatus(`❌ Connection failed: ${err?.message || err}`)
      }
    }

    testConnection()
  }, [supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Supabase Connection Test
        </h1>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-lg">{connectionStatus}</p>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Project URL:</strong></p>
          <p className="break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        </div>
      </div>
    </div>
  )
}