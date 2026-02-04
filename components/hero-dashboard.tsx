'use client'

import { motion } from 'framer-motion'

/**
 * Hero Dashboard Illustration
 * Preview do controle financeiro que o usuário terá
 * Mostra métricas que serão alimentadas pelo registro mensal
 */
export function HeroDashboard() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Glow effect behind */}
      <div className="absolute inset-0 blur-3xl opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-mei-500 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Main Dashboard Card */}
        <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-muted-foreground font-medium">Calcula MEI</span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-5 space-y-4">
            {/* Metric Cards Row */}
            <div className="grid grid-cols-3 gap-3">
              <MetricCard
                label="Faturamento"
                value="R$ 54.200"
                trend="+12%"
                positive
                delay={0.2}
              />
              <MetricCard
                label="Margem"
                value="42,5%"
                trend="+3,2%"
                positive
                delay={0.3}
              />
              <MetricCard
                label="Limite MEI"
                value="66,9%"
                trend="OK"
                neutral
                delay={0.4}
              />
            </div>

            {/* Chart Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-secondary/50 rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Evolução Mensal</span>
                <span className="text-xs text-mei-500 font-semibold">2026</span>
              </div>

              {/* Animated Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-24">
                {[40, 55, 45, 65, 50, 75, 85, 70, 90, 80, 95, 100].map((height, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      background: i === 11
                        ? 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary) / 0.7))'
                        : i >= 9
                          ? 'hsl(var(--primary) / 0.6)'
                          : 'hsl(var(--muted-foreground) / 0.2)',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 0.6 + i * 0.05,
                      duration: 0.4,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </div>

              {/* Month labels */}
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">Jan</span>
                <span className="text-[10px] text-muted-foreground">Jun</span>
                <span className="text-[10px] text-muted-foreground">Dez</span>
              </div>
            </motion.div>

            {/* Action Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-3"
            >
              <div className="flex-1 bg-mei-500/10 border border-mei-500/30 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-mei-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Próximo DAS</p>
                    <p className="text-[10px] text-muted-foreground">20/02 • R$ 75,40</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-secondary/80 border border-border rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Lucro Mês</p>
                    <p className="text-[10px] text-mei-600 font-medium">+R$ 3.521</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-3 -right-3 bg-mei-500 text-white px-3 py-1.5 rounded-full shadow-lg text-sm font-bold"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 1, stiffness: 200 }}
        >
          +35% lucro
        </motion.div>

        <motion.div
          className="absolute -bottom-2 -left-2 bg-card border border-border px-3 py-2 rounded-lg shadow-lg"
          initial={{ scale: 0, x: 20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: 'spring', delay: 1.1 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-medium text-foreground">Dentro do limite</span>
          </div>
        </motion.div>

        {/* Animated particles */}
        <motion.div
          className="absolute top-1/4 -right-6 w-4 h-4 rounded-full bg-mei-400/60"
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 -left-4 w-3 h-3 rounded-full bg-amber-400/60"
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.div
          className="absolute top-2/3 -right-8 w-2 h-2 rounded-full bg-mei-500/40"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 1 }}
        />
      </motion.div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  trend,
  positive = false,
  neutral = false,
  delay = 0
}: {
  label: string
  value: string
  trend: string
  positive?: boolean
  neutral?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-secondary/50 rounded-lg p-3 border border-border/50"
    >
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
      <p className={`text-[10px] font-medium mt-0.5 ${
        neutral ? 'text-blue-500' : positive ? 'text-green-500' : 'text-red-500'
      }`}>
        {trend}
      </p>
    </motion.div>
  )
}
