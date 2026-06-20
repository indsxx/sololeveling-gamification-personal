import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { supabase } from './lib/supabase'
import useGameStore from './store/useGameStore'
import AuthGuard from './components/AuthGuard'

const CommandCenter = lazy(() => import('./pages/CommandCenter'))
const CharacterSheet = lazy(() => import('./pages/CharacterSheet'))
const QuestLog = lazy(() => import('./pages/QuestLog'))
const BossPage = lazy(() => import('./pages/BossPage'))
const SkillTree = lazy(() => import('./pages/SkillTree'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

const NAV_ITEMS = [
  { to: '/', icon: '⌂', label: 'Command Center' },
  { to: '/character', icon: '◈', label: 'Character' },
  { to: '/quests', icon: '◉', label: 'Quests' },
  { to: '/boss', icon: '⚔', label: 'Boss' },
  { to: '/skills', icon: '✦', label: 'Skills' },
]

function Sidebar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 60,
        height: '100vh',
        backgroundColor: '#12161D',
        borderRight: '1px solid #2A3140',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        gap: 4,
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          title={label}
          style={({ isActive }) => ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 44,
            height: 44,
            borderRadius: 8,
            fontSize: '1.25rem',
            textDecoration: 'none',
            color: isActive ? '#0066FF' : '#5C6678',
            backgroundColor: isActive ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
            transition: 'color 0.15s, background-color 0.15s',
          })}
        >
          {icon}
        </NavLink>
      ))}
    </nav>
  )
}

function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontFamily: 'Michroma, sans-serif',
        color: '#3D7FFF',
        fontSize: '1.25rem',
      }}
    >
      LOADING...
    </div>
  )
}

export default function App() {
  const setUser = useGameStore((s) => s.setUser)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <AuthGuard>
              <Sidebar />
              <main style={{ marginLeft: 60 }}>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<CommandCenter />} />
                    <Route path="/character" element={<CharacterSheet />} />
                    <Route path="/quests" element={<QuestLog />} />
                    <Route path="/boss" element={<BossPage />} />
                    <Route path="/skills" element={<SkillTree />} />
                  </Routes>
                </Suspense>
              </main>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
