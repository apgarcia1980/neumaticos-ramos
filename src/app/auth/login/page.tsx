'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-theme flex flex-col relative overflow-hidden">

      {/* Línea roja lateral izquierda */}
      <div className="absolute left-0 top-0 w-1 h-full bg-primary-theme" />

      {/* Grid decorativo de fondo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 40px, white 40px, white 41px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, white 40px, white 41px)
          `,
        }}
      />

      {/* Anillo decorativo — neumático */}
      <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[60px] border-white/[0.015] pointer-events-none hidden lg:block" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary-theme/[0.08] pointer-events-none hidden lg:block" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-theme flex items-center justify-center text-lg rounded-sm">
            🔧
          </div>
          <span className="display-title text-xl text-white">
            Neumáticos <span className="text-primary-theme">Ramos</span>
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/" className="eyebrow text-[10px] text-white/30 hover:text-white/60 transition-colors">
            Ver web
          </Link>
          <span className="eyebrow text-[10px] text-white/20">v1.0.0</span>
        </nav>
      </header>

      {/* Centro — formulario */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px] bg-surface border border-white/[0.08] border-t-2 border-t-primary-theme p-10 animate-fade-in-up">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-0.5 bg-primary-theme" />
            <span className="eyebrow">Acceso seguro</span>
          </div>

          <h1 className="display-title text-[26px] text-white mb-2">
            Autenticación del sistema
          </h1>
          <p className="text-sm text-white/40 mb-8 leading-relaxed">
            Introduce tus credenciales para acceder al panel de gestión.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-950/40 border border-red-800/40 border-l-2 border-l-red-500 px-4 py-3 mb-6 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="label-theme">Email</label>
            <div className="relative">
              <input
                className="input-theme pr-10"
                type="email"
                placeholder="admin@neumaticosramos.es"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoComplete="email"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none">
                @
              </span>
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-8">
            <label className="label-theme">Contraseña</label>
            <div className="relative">
              <input
                className="input-theme pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-sm"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            className="btn-primary-theme w-full"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              'Acceder →'
            )}
          </button>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow" />
              <span className="eyebrow text-[10px] text-white/30">Sistema operativo</span>
            </div>
            <span className="eyebrow text-[10px] text-white/20">ENC-256 AES</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between px-8 py-4 border-t border-white/[0.06]">
        <p className="text-[10px] uppercase tracking-widest text-white/20">
          © 2025 <span className="text-white/35">Neumáticos Ramos</span> · Panel de administración
        </p>
        <div className="hidden sm:flex gap-5">
          <Link href="#" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors">
            Privacidad
          </Link>
          <Link href="#" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors">
            Estado del sistema
          </Link>
        </div>
      </footer>
    </div>
  )
}