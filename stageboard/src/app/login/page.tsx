"use client"

import React, { useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import './login.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault() 
    setLoading(true)

    const result = await supabaseClient.auth.signInWithOtp({email})

    if (result.error) {
        setMessage('Er is iets fout gegaan: ' + result.error.message)
    } else {
        setMessage("Bekijk uw email voor de login link")
    }

     setLoading(false)
  }
  
  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
      setEmail(event.target.value)
  }

  return(
    <main className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1 className="login-title">Login</h1>

        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          className="login-input"
        />

        <button type="submit" disabled={loading} className="login-button">
            Send Magic Link
        </button>
      </form>

      {message && <p className="login-message">{message}</p>}

    </main>
  ) 
}