import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BlueBackground from '../components/ui/BlueBackground'
import GlassCard from '../components/ui/GlassCard'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message)
        } else {
          navigate('/')
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setError(error.message)
        } else {
          setError('Check your email for confirmation link.')
        }
      }
    } catch (err) {
      setError(err.message || 'Connection failed.')
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <BlueBackground />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #0066FF, #3D7FFF)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <polygon points="12,2 22,22 2,22" />
          </svg>
        </div>
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 32,
            color: '#E7ECF5',
            letterSpacing: '0.05em',
            margin: 0,
            fontWeight: 700,
          }}
        >
          ASCEND
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            color: '#5C6678',
            margin: '8px 0 0',
            letterSpacing: '0.15em',
          }}
        >
          HUNTER SYSTEM v1.0
        </p>
      </div>

      <GlassCard style={{ width: 380, position: 'relative', zIndex: 10 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                color: '#5C6678',
                display: 'block',
                marginBottom: 6,
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}
            >
              HUNTER ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(0, 102, 255, 0.15)',
                borderRadius: 8,
                color: '#E7ECF5',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 14,
                padding: '12px 14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0066FF')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 102, 255, 0.15)')}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                color: '#5C6678',
                display: 'block',
                marginBottom: 6,
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}
            >
              ACCESS CODE
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(0, 102, 255, 0.15)',
                borderRadius: 8,
                color: '#E7ECF5',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 14,
                padding: '12px 14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0066FF')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 102, 255, 0.15)')}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#C23B3B', margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#5C6678' : 'linear-gradient(135deg, #0066FF, #3D7FFF)',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: 8,
              padding: '14px 0',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14,
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'INITIALIZING...' : isLogin ? 'INITIALIZE' : 'REGISTER'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={() => { setMode(isLogin ? 'register' : 'login'); setError('') }}
            style={{
              background: 'none',
              border: 'none',
              color: '#5C6678',
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {isLogin ? 'NO ACCOUNT? REGISTER' : 'ALREADY REGISTERED? LOGIN'}
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
