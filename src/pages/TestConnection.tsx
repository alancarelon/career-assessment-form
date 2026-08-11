import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check environment variables
        setEnvVars({
          url: import.meta.env.VITE_SUPABASE_URL,
          keyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          keyPreview: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
        })

        // Test database connection
        const { data, error } = await supabase
          .from('assessments')
          .select('count')
          .limit(1)

        if (error) {
          setStatus(`❌ Error: ${error.message}`)
        } else {
          setStatus('✅ Connection successful!')
        }
      } catch (err: any) {
        setStatus(`❌ Exception: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded">
            <h2 className="font-bold mb-2">Connection Status:</h2>
            <p className="text-lg">{status}</p>
          </div>

          <div className="p-4 bg-slate-100 rounded">
            <h2 className="font-bold mb-2">Environment Variables:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(envVars, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h2 className="font-bold mb-2">Instructions:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>If URL is undefined: Environment variables not loaded</li>
              <li>If you see an error: Check the error message</li>
              <li>If successful: Database connection is working!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
