"use client"

import React, { useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault() 
    setLoading(true)

    const result = await supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/tasks'
      }
    })

    if (result.error) {
        setMessage('Something went wrong: ' + result.error.message)
    } else {
        setMessage("Check email for the login link")
    }

     setLoading(false)
  }
  
  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
      setEmail(event.target.value)
  }

  return(
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-6 bg-gray-800 rounded-xl shadow-md w-80"
      >
        <h1 className="text-xl font-bold text-blue-600 text-center">Login</h1>
    
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          className="border border-gray-400 rounded-md p-2 text-white"
        />
    
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send Magic Link
        </button>
    
        {message && <p className="text-white text-sm mt-2">{message}</p>}
      </form>
    </main>
  ) 
}