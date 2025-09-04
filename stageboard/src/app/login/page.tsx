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
    setMessage("")

    const trimmedEmail = email.trim()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setMessage("Please enter a valid email address")
      setLoading(false)
      return
    }

    const { error } = await supabaseClient.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: 'http://localhost:3000/tasks'
      }
    })

    if (error) {
      setMessage('Something went wrong: ' + error.message)
    } else {
      setMessage("Check your email for the login link")
    }

    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-md"
      >
        <h1 className="text-2xl font-bold text-blue-500 text-center">Login</h1>
  
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="border border-gray-600 rounded-md p-3 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
  
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition text-white py-2 rounded-md shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
  
        {message && (
          <p className="text-gray-300 text-sm text-center mt-2">{message}</p>
        )}
      </form>
    </main>
  );
}
