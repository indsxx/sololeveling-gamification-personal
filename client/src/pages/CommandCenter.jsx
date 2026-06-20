import { useState, useEffect } from 'react'
import useGameStore from '../store/useGameStore'
import { supabase } from '../lib/supabase'
import { SegmentMeter, RankLadder } from '../components/ui'
import SystemMessage from '../components/ui/SystemMessage'
import BlueBackground from '../components/ui/BlueBackground'
import GlassCard from '../components/ui/GlassCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function SystemToast({ id, title, subtitle, type, visible, onDismiss }) {
  return (
    <div
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        marginBottom: 8,
      }}
    >
      <SystemMessage
        title={title}
        subtitle={subtitle}
        type={type}
        visible={visible}
        onDismiss={() => onDismiss(id)}
      />
    </div>
  )
}

function ProgressBar({ value, color = 'blue' }) {
  const gradients = {
    blue: 'linear-gradient(90deg, #0066FF 0%, #3D7FFF 100%)',
    gold: 'linear-gradient(90deg, #D4A53D 0%, #e4c06d 100%)',
    red: 'linear-gradient(90deg, #C23B3B 0%, #e05555 100%)',
  }

  return (
    <div
      style={{
        height: 6,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${value}%`,
          background: gradients[color],
          borderRadius: 3,
        }}
      />
    </div>
  )
}

function StatCard({ label, value, suffix, color = 'blue' }) {
  const colors = {
    blue: '#0066FF',
    gold: '#D4A53D',
    white: '#E7ECF5',
  }

  return (
    <GlassCard hover>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          color: '#5C6678',
          letterSpacing: '0.15em',
          marginBottom: 8,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 32,
            color: colors[color],
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 14,
              color: '#5C6678',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </GlassCard>
  )
}

export default function CommandCenter() {
  const {
    currentXP,
    currentLevel,
    currentRank,
    todayQuests,
    todayXP,
    systemMessages,
    completeQuest,
    addXP,
    setProfile,
    setTodayQuests,
    dismissSystemMessage,
  } = useGameStore()

  const [loading, setLoading] = useState(true)
  const [visibleMessages, setVisibleMessages] = useState({})

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      try {
        const [statsRes, questsRes] = await Promise.all([
          fetch(`${API_URL}/stats/${user.id}`),
          fetch(`${API_URL}/quests/${user.id}/today`),
        ])

        if (statsRes.ok) {
          const profile = await statsRes.json()
          if (!cancelled) setProfile(profile)
        }

        if (questsRes.ok) {
          const quests = await questsRes.json()
          if (!cancelled) setTodayQuests(quests)
        }
      } catch (err) {
        console.error('[CommandCenter] Failed to fetch data:', err)
      }

      if (!cancelled) setLoading(false)
    }

    fetchData()

    return () => { cancelled = true }
  }, [setProfile, setTodayQuests])

  useEffect(() => {
    let channel = null

    async function subscribe() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel('events-realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'events', filter: `user_id=eq.${user.id}` },
          (payload) => {
            addXP(payload.new.xp_earned, payload.new.category)
          }
        )
        .subscribe()
    }

    subscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [addXP])

  const handleQuestComplete = async (quest) => {
    try {
      const res = await fetch(`${API_URL}/quests/${quest.id}/complete`, { method: 'PATCH' })
      if (!res.ok) return
    } catch (err) {
      console.error('[CommandCenter] Failed to complete quest:', err)
      return
    }

    completeQuest(quest.id)
    useGameStore.getState().addSystemMessage({
      title: 'Quest Completed',
      subtitle: quest.title,
      rewards: [`+${quest.xp_reward} XP`],
      type: 'reward',
    })
    const newId = useGameStore.getState().systemMessages.at(-1)?.id
    if (newId) {
      setVisibleMessages((prev) => ({ ...prev, [newId]: false }))
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisibleMessages((prev) => ({ ...prev, [newId]: true }))
        })
      })
      setTimeout(() => {
        setVisibleMessages((prev) => ({ ...prev, [newId]: false }))
        setTimeout(() => dismissSystemMessage(newId), 500)
      }, 4000)
    }
  }

  const quests = todayQuests
  const completedCount = quests.filter((q) => q.completed).length
  const streak = useGameStore((s) => s.profile?.streak ?? 0)

  const prevThreshold = (level) => {
    if (level <= 1) return 0
    let t = 800
    let inc = 1000
    for (let i = 2; i < level; i++) {
      t += inc
      inc += 200
    }
    return t
  }

  const nextThreshold = (level) => {
    if (level < 2) return 800
    let t = 800
    let inc = 1000
    for (let i = 2; i <= level; i++) {
      t += inc
      inc += 200
    }
    return t
  }

  const xpInLevel = currentXP - prevThreshold(currentLevel)
  const xpForNext = nextThreshold(currentLevel) - prevThreshold(currentLevel)
  const xpDisplay = `${xpInLevel} / ${xpForNext} XP`
  const xpPercent = Math.round((xpInLevel / xpForNext) * 100)

  const now = new Date()
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <BlueBackground />

      {loading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 200,
            backgroundColor: '#000000',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: '#5C6678',
              letterSpacing: '0.15em',
            }}
          >
            LOADING HUNTER DATA...
          </span>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {systemMessages.map((msg) => (
          <SystemToast
            key={msg.id}
            id={msg.id}
            title={msg.title}
            subtitle={msg.subtitle}
            type={msg.type}
            visible={visibleMessages[msg.id] ?? false}
            onDismiss={(id) => {
              setVisibleMessages((prev) => ({ ...prev, [id]: false }))
              setTimeout(() => dismissSystemMessage(id), 400)
            }}
          />
        ))}
      </div>

      <header
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #0066FF, #3D7FFF)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <polygon points="12,2 22,22 2,22" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 18,
                color: '#E7ECF5',
                fontWeight: 700,
              }}
            >
              ASCEND
            </span>
          </div>

          <RankLadder currentRank={currentRank} />

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 14,
                color: '#E7ECF5',
                fontWeight: 700,
              }}
            >
              LV. {currentLevel}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: '#5C6678',
              }}
            >
              {xpDisplay}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <ProgressBar value={xpPercent} color="blue" />
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 10, padding: '16px 24px' }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            color: '#5C6678',
            letterSpacing: '0.15em',
            marginBottom: 24,
            fontWeight: 500,
          }}
        >
          WELCOME BACK, HUNTER.
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 1fr',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <GlassCard>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  color: '#5C6678',
                  letterSpacing: '0.15em',
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                TODAY&apos;S STATUS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SegmentMeter label="ENERGY" value={4} total={8} />
                <SegmentMeter label="FOCUS" value={5} total={8} />
                <SegmentMeter label="DISCIPLINE" value={6} total={8} />
                <SegmentMeter label="MOOD" value={3} total={8} />
              </div>
            </GlassCard>

            <GlassCard>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  color: '#5C6678',
                  letterSpacing: '0.15em',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                MAIN QUEST
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 16,
                  color: '#E7ECF5',
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                Become an Elite Video Editor
              </div>
              <SegmentMeter label="PROGRESS" value={3} total={8} />
            </GlassCard>
          </div>

          <GlassCard active>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  color: '#0066FF',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                }}
              >
                DAILY QUESTS
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  color: '#5C6678',
                }}
              >
                {dateStr}
              </span>
            </div>

            <div
              style={{
                height: 1,
                background: 'rgba(0, 102, 255, 0.1)',
                marginBottom: 12,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => !quest.completed && handleQuestComplete(quest)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    background: quest.completed ? 'rgba(0, 102, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 8,
                    cursor: quest.completed ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(0, 102, 255, 0.05)',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: quest.completed ? 'rgba(0, 102, 255, 0.2)' : 'rgba(212, 165, 61, 0.2)',
                      color: quest.completed ? '#0066FF' : '#D4A53D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {quest.completed ? (
                        <polyline points="20 6 9 17 4 12" />
                      ) : (
                        <circle cx="12" cy="12" r="10" />
                      )}
                    </svg>
                  </div>

                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      color: quest.completed ? '#5C6678' : '#E7ECF5',
                      textDecoration: quest.completed ? 'line-through' : 'none',
                      flex: 1,
                    }}
                  >
                    {quest.title}
                  </span>

                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                      color: '#D4A53D',
                      flexShrink: 0,
                    }}
                  >
                    +{quest.xp_reward} XP
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <StatCard label="STREAK" value={streak} suffix="DAYS" color="gold" />
              <StatCard label="XP TODAY" value={todayXP} color="blue" />
            </div>

            <GlassCard>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  color: '#5C6678',
                  letterSpacing: '0.15em',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                QUESTS COMPLETED
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 32,
                    color: '#E7ECF5',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {completedCount}
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 16,
                    color: '#5C6678',
                  }}
                >
                  / {quests.length}
                </span>
              </div>
              <div style={{ marginTop: 12 }}>
                <ProgressBar
                  value={quests.length > 0 ? (completedCount / quests.length) * 100 : 0}
                  color="gold"
                />
              </div>
            </GlassCard>

            <GlassCard>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'rgba(0, 102, 255, 0.2)',
                    color: '#0066FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    color: '#0066FF',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                  }}
                >
                  SYSTEM
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  lineHeight: 1.7,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ color: '#8B95A5' }}>
                  You have completed {quests.length > 0 ? Math.round((completedCount / quests.length) * 100) : 0}% of today&apos;s objectives.
                </div>
                <div>
                  <span style={{ color: '#E7ECF5', fontWeight: 600 }}>Observation:</span>{' '}
                  <span style={{ color: '#8B95A5' }}>
                    Productivity drops between 14:00–15:30.
                  </span>
                </div>
                <div>
                  <span style={{ color: '#E7ECF5', fontWeight: 600 }}>Recommendation:</span>{' '}
                  <span style={{ color: '#8B95A5' }}>
                    Move creative work to 09:00.
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
