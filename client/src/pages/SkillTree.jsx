import BlueBackground from '../components/ui/BlueBackground'
import GlassCard from '../components/ui/GlassCard'

const SKILLS = [
  { id: 1, name: 'Focus Mastery', level: 3, maxLevel: 5, unlocked: true, color: '#0066FF' },
  { id: 2, name: 'Time Management', level: 2, maxLevel: 5, unlocked: true, color: '#0066FF' },
  { id: 3, name: 'Deep Work', level: 0, maxLevel: 5, unlocked: false, color: '#5C6678' },
  { id: 4, name: 'Morning Routine', level: 4, maxLevel: 5, unlocked: true, color: '#D4A53D' },
  { id: 5, name: 'Exercise', level: 1, maxLevel: 5, unlocked: true, color: '#0066FF' },
  { id: 6, name: 'Meditation', level: 0, maxLevel: 5, unlocked: false, color: '#5C6678' },
]

function SkillNode({ skill }) {
  return (
    <GlassCard hover style={{ opacity: skill.unlocked ? 1 : 0.5 }}>
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
            fontSize: 14,
            color: skill.unlocked ? '#E7ECF5' : '#5C6678',
            fontWeight: 600,
          }}
        >
          {skill.name}
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            color: skill.color,
          }}
        >
          {skill.level}/{skill.maxLevel}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: skill.maxLevel }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i < skill.level ? skill.color : 'rgba(255, 255, 255, 0.08)',
            }}
          />
        ))}
      </div>
    </GlassCard>
  )
}

export default function SkillTree() {
  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <BlueBackground />

      <div style={{ position: 'relative', zIndex: 10, padding: '24px' }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 28,
            color: '#E7ECF5',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Skill Tree
        </div>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: '#8B95A5',
            marginBottom: 32,
          }}
        >
          Develop your abilities to unlock new powers
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {SKILLS.map((skill) => (
            <SkillNode key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  )
}
