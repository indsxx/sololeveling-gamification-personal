import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CornerFrame } from '../components/ui'
import GlassPanel from '../components/ui/GlassPanel'
import EnergyConduit from '../components/ui/EnergyConduit'
import WorldManager from '../components/dungeon/WorldManager'
import DungeonScene from '../components/dungeon/DungeonScene'

const TABS = [
  { key: 'daily', label: 'DAILY' },
  { key: 'dungeon', label: 'DUNGEON' },
  { key: 'story', label: 'STORY' },
]

const DIFFICULTY_COLORS = {
  S: '#D4A53D',
  A: '#3D7FFF',
}

const DAILY_QUESTS = [
  {
    id: 'd1',
    title: 'Morning Protocol',
    difficulty: 'C',
    xp: 150,
    gold: 0,
    objectives: [
      { text: 'Wake by 07:00', done: true },
      { text: 'Cold shower', done: true },
      { text: 'Journal 5min', done: false },
    ],
  },
  {
    id: 'd2',
    title: 'Warrior Training',
    difficulty: 'B',
    xp: 200,
    gold: 25,
    objectives: [
      { text: 'Warm-up 10min', done: false },
      { text: 'Main workout 40min', done: false },
      { text: 'Stretching', done: false },
    ],
  },
  {
    id: 'd3',
    title: 'Knowledge Absorption',
    difficulty: 'D',
    xp: 100,
    gold: 0,
    objectives: [
      { text: 'Read 20 pages', done: false },
      { text: 'Take notes', done: false },
    ],
  },
]

const DUNGEONS = [
  {
    id: 'dg1',
    title: '75 HARD DUNGEON',
    difficulty: 'A',
    xp: 2500,
    badge: 'MENTAL FORTITUDE',
    description:
      'Complete 75 consecutive days of dual workouts, outdoor walk, diet, reading, and progress photo.',
  },
  {
    id: 'dg2',
    title: 'DEEP WORK DUNGEON',
    difficulty: 'B',
    xp: 1200,
    badge: null,
    description: '30 Hours of deep work this week',
    bonus: 'Focus +5',
  },
]

const CHAPTERS = [
  {
    id: 'ch1',
    number: 1,
    title: 'ESCAPE AVERAGE',
    boss: 'Procrastination',
    reward: 'Rank D',
    status: 'in_progress',
  },
  {
    id: 'ch2',
    number: 2,
    title: 'BUILD MOMENTUM',
    boss: 'Inconsistency',
    reward: null,
    status: 'locked',
  },
  {
    id: 'ch9',
    number: 9,
    title: 'FINANCIAL FREEDOM',
    boss: null,
    reward: null,
    status: 'locked',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const tabContentVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
}

function DailyTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {DAILY_QUESTS.map((quest) => (
        <motion.div key={quest.id} variants={itemVariants}>
          <CornerFrame active hover padding="20px" glowing style={{ width: '100%' }}>
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
                  fontFamily: 'Michroma, sans-serif',
                  fontSize: 15,
                  color: '#E7ECF5',
                  letterSpacing: '0.05em',
                }}
              >
                {quest.title}
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: DIFFICULTY_COLORS[quest.difficulty] || '#5C6678',
                  fontWeight: 600,
                }}
              >
                [{quest.difficulty}]
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {quest.objectives.map((obj, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'Public Sans, sans-serif',
                    fontSize: 13,
                    color: obj.done ? '#5C6678' : '#8B95A5',
                    textDecoration: obj.done ? 'line-through' : 'none',
                    lineHeight: 1.6,
                  }}
                >
                  {obj.done ? '■' : '□'} {obj.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: '#D4A53D',
                  fontWeight: 600,
                }}
              >
                +{quest.xp} XP
              </span>
              {quest.gold > 0 && (
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12,
                    color: '#D4A53D',
                    fontWeight: 600,
                  }}
                >
                  +{quest.gold} Gold
                </span>
              )}
            </div>
          </CornerFrame>
        </motion.div>
      ))}
    </motion.div>
  )
}

function DungeonTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
    >
      {DUNGEONS.map((dungeon) => (
        <motion.div key={dungeon.id} variants={itemVariants}>
          <CornerFrame active activeColor="#C23B3B" glowing hover padding="20px" style={{ width: '100%' }}>
            <div
              style={{
                fontFamily: 'Michroma, sans-serif',
                fontSize: 15,
                color: '#E7ECF5',
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              {dungeon.title}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: DIFFICULTY_COLORS[dungeon.difficulty] || '#5C6678',
                  fontWeight: 600,
                }}
              >
                [{dungeon.difficulty}]
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: '#D4A53D',
                  fontWeight: 600,
                }}
              >
                {dungeon.xp.toLocaleString()} XP
              </span>
            </div>

            {dungeon.badge && (
              <div
                style={{
                  fontFamily: 'Michroma, sans-serif',
                  fontSize: 10,
                  color: '#C23B3B',
                  letterSpacing: '0.2em',
                  border: '1px solid #C23B3B',
                  display: 'inline-block',
                  padding: '4px 12px',
                  marginBottom: 12,
                }}
              >
                {dungeon.badge}
              </div>
            )}

            <div
              style={{
                fontFamily: 'Public Sans, sans-serif',
                fontSize: 13,
                color: '#8B95A5',
                lineHeight: 1.6,
                marginBottom: dungeon.bonus ? 8 : 0,
              }}
            >
              {dungeon.description}
            </div>

            {dungeon.bonus && (
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  color: '#3D7FFF',
                }}
              >
                {dungeon.bonus}
              </div>
            )}
          </CornerFrame>
        </motion.div>
      ))}
    </motion.div>
  )
}

function StoryTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ position: 'relative', paddingLeft: 40 }}
    >
      <EnergyConduit chapters={CHAPTERS} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {CHAPTERS.map((ch) => {
          const locked = ch.status === 'locked'
          const inProgress = ch.status === 'in_progress'

          return (
            <motion.div key={ch.id} variants={itemVariants}>
              <CornerFrame
                active={inProgress}
                hover={!locked}
                padding="20px"
                glowing={inProgress}
                style={{ width: '100%', opacity: locked ? 0.5 : 1 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Michroma, sans-serif',
                      fontSize: 10,
                      color: locked ? '#2A3140' : '#5C6678',
                      letterSpacing: '0.2em',
                    }}
                  >
                    CH.{ch.number}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Michroma, sans-serif',
                      fontSize: 15,
                      color: locked ? '#2A3140' : '#E7ECF5',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {ch.title}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  {ch.boss && (
                    <div>
                      <span
                        style={{
                          fontFamily: 'Michroma, sans-serif',
                          fontSize: 10,
                          color: locked ? '#2A3140' : '#5C6678',
                          letterSpacing: '0.15em',
                        }}
                      >
                        BOSS:{' '}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Public Sans, sans-serif',
                          fontSize: 13,
                          color: locked ? '#2A3140' : '#C23B3B',
                        }}
                      >
                        {ch.boss}
                      </span>
                    </div>
                  )}

                  {ch.reward && (
                    <div>
                      <span
                        style={{
                          fontFamily: 'Michroma, sans-serif',
                          fontSize: 10,
                          color: locked ? '#2A3140' : '#5C6678',
                          letterSpacing: '0.15em',
                        }}
                      >
                        REWARD:{' '}
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12,
                          color: locked ? '#2A3140' : '#D4A53D',
                          fontWeight: 600,
                        }}
                      >
                        {ch.reward}
                      </span>
                    </div>
                  )}

                  <span
                    style={{
                      fontFamily: 'Michroma, sans-serif',
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      color: locked ? '#2A3140' : inProgress ? '#3D7FFF' : '#5C6678',
                      marginLeft: 'auto',
                    }}
                  >
                    {locked ? 'LOCKED' : inProgress ? 'IN PROGRESS' : 'COMPLETE'}
                  </span>
                </div>
              </CornerFrame>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function QuestLog() {
  const [activeTab, setActiveTab] = useState('daily')

  return (
    <WorldManager>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0A0C10',
          padding: '0 24px 24px',
          position: 'relative',
        }}
      >
        <DungeonScene />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontFamily: 'Michroma, sans-serif',
              fontSize: 14,
              color: '#E7ECF5',
              letterSpacing: '0.25em',
              padding: '16px 0',
              marginBottom: 24,
              fontWeight: 700,
            }}
          >
            QUEST LOG
          </div>

          <GlassPanel
            hover={false}
            style={{ marginBottom: 24, padding: '0 20px' }}
          >
            <div
              style={{
                display: 'flex',
                gap: 24,
                borderBottom: '1px solid rgba(61, 127, 255, 0.15)',
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Michroma, sans-serif',
                    fontSize: 12,
                    letterSpacing: '0.2em',
                    fontWeight: 600,
                    color: activeTab === tab.key ? '#3D7FFF' : '#5C6678',
                    paddingBottom: 16,
                    borderBottom:
                      activeTab === tab.key ? '2px solid #3D7FFF' : '2px solid transparent',
                    marginBottom: -1,
                    transition: 'color 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </GlassPanel>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {activeTab === 'daily' && <DailyTab />}
              {activeTab === 'dungeon' && <DungeonTab />}
              {activeTab === 'story' && <StoryTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </WorldManager>
  )
}
