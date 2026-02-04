'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Flame, Trophy } from 'lucide-react'

interface StreakData {
  currentStreak: number
  longestStreak: number
}

export function StreakWidget() {
  const [streak, setStreak] = useState<StreakData | null>(null)

  useEffect(() => {
    // Atualiza streak ao carregar
    fetch('/api/streak', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStreak({
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
          })
        }
      })
      .catch(console.error)
  }, [])

  if (!streak || streak.currentStreak === 0) {
    return null
  }

  const isOnFire = streak.currentStreak >= 7
  const isRecord = streak.currentStreak === streak.longestStreak && streak.currentStreak > 1

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className={`p-3 ${isOnFire ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isOnFire
                ? 'bg-gradient-to-br from-orange-400 to-red-500'
                : 'bg-orange-100 dark:bg-orange-900/30'
            }`}>
              <Flame className={`w-5 h-5 ${isOnFire ? 'text-white' : 'text-orange-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-foreground">
                  {streak.currentStreak} {streak.currentStreak === 1 ? 'dia' : 'dias'}
                </span>
                {isRecord && (
                  <span className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                    <Trophy className="w-3 h-3" />
                    Recorde!
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isOnFire ? 'Voce esta em chamas!' : 'de sequencia'}
              </p>
            </div>
          </div>

          {streak.longestStreak > streak.currentStreak && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Recorde</p>
              <p className="font-semibold text-foreground">{streak.longestStreak} dias</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
