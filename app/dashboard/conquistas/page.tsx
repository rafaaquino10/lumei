'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import {
  Trophy,
  Star,
  Flame,
  Target,
  TrendingUp,
  Calculator,
  Calendar,
  Crown,
  Rocket,
  Moon,
  Sun,
  Award,
  FileText,
  FileDown,
  UserCheck,
  Sparkles,
  Lock,
} from 'lucide-react'
import { BadgeCategory } from '@prisma/client'

// Map icon names to components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Star,
  Flame,
  Target,
  TrendingUp,
  Calculator,
  Calendar,
  Crown,
  Rocket,
  Moon,
  Sun,
  Award,
  FileText,
  FileDown,
  UserCheck,
  Sparkles,
}

interface Badge {
  slug: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  points: number
  unlocked: boolean
  unlockedAt?: string
}

interface BadgesData {
  badges: Badge[]
  totalPoints: number
  unlockedCount: number
  totalCount: number
}

const CATEGORY_LABELS: Record<BadgeCategory, { label: string; description: string }> = {
  ONBOARDING: { label: 'Inicio', description: 'Primeiros passos no Calcula MEI' },
  CONSISTENCY: { label: 'Consistencia', description: 'Mantenha o ritmo!' },
  MILESTONE: { label: 'Marcos', description: 'Conquistas de faturamento' },
  FINANCIAL: { label: 'Financeiro', description: 'Dominio das ferramentas' },
  SOCIAL: { label: 'Social', description: 'Badges especiais da comunidade' },
  SPECIAL: { label: 'Especiais', description: 'Conquistas raras' },
}

export default function ConquistasPage() {
  const [data, setData] = useState<BadgesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/badges')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-accent rounded" />
          <div className="h-24 bg-accent rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-accent rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Erro ao carregar conquistas.</p>
      </div>
    )
  }

  const categories = Object.keys(CATEGORY_LABELS) as BadgeCategory[]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Conquistas</h1>
        <p className="text-muted-foreground">
          Desbloqueie badges e acumule pontos usando o Calcula MEI
        </p>
      </div>

      {/* Stats */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{data.totalPoints}</p>
              <p className="text-sm text-muted-foreground">pontos totais</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-2xl font-bold text-foreground">
              {data.unlockedCount}/{data.totalCount}
            </p>
            <p className="text-sm text-muted-foreground">badges desbloqueados</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(data.unlockedCount / data.totalCount) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </Card>

      {/* Badges by Category */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryBadges = data.badges.filter(b => b.category === category)
          if (categoryBadges.length === 0) return null

          const unlockedInCategory = categoryBadges.filter(b => b.unlocked).length

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {CATEGORY_LABELS[category].label}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[category].description}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {unlockedInCategory}/{categoryBadges.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoryBadges.map((badge, index) => {
                  const IconComponent = ICON_MAP[badge.icon] || Star

                  return (
                    <motion.div
                      key={badge.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`p-4 text-center transition-all ${
                          badge.unlocked
                            ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'
                            : 'bg-secondary/50 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                            badge.unlocked
                              ? 'bg-primary/20'
                              : 'bg-muted-foreground/20'
                          }`}
                        >
                          {badge.unlocked ? (
                            <IconComponent
                              className={`w-6 h-6 ${
                                badge.unlocked ? 'text-primary' : 'text-muted-foreground'
                              }`}
                            />
                          ) : (
                            <Lock className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>

                        <h3 className="font-semibold text-sm text-foreground mb-1">
                          {badge.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {badge.description}
                        </p>
                        <span
                          className={`text-xs font-medium ${
                            badge.unlocked ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          +{badge.points} pts
                        </span>

                        {badge.unlocked && badge.unlockedAt && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
