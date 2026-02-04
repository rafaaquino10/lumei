'use client'

import { motion } from 'framer-motion'

/**
 * Ilustracao SVG animada para a hero section
 * Representa conceitos de financas, calculadoras e crescimento para MEI
 */
export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Background gradient circle */}
        <defs>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="barGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Background decorative circle */}
        <motion.circle
          cx="200"
          cy="150"
          r="120"
          fill="url(#heroGradient)"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Calculator body */}
        <motion.g
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Calculator frame */}
          <rect
            x="120"
            y="80"
            width="160"
            height="140"
            rx="12"
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />

          {/* Calculator screen */}
          <rect
            x="135"
            y="95"
            width="130"
            height="40"
            rx="6"
            fill="hsl(var(--secondary))"
          />

          {/* Screen display text */}
          <motion.text
            x="250"
            y="122"
            textAnchor="end"
            className="fill-foreground font-bold"
            fontSize="18"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            R$ 3.521
          </motion.text>

          {/* Calculator buttons grid */}
          {[
            [0, 0], [1, 0], [2, 0], [3, 0],
            [0, 1], [1, 1], [2, 1], [3, 1],
            [0, 2], [1, 2], [2, 2], [3, 2],
          ].map(([col, row], i) => (
            <motion.rect
              key={i}
              x={135 + col * 33}
              y={145 + row * 22}
              width="28"
              height="18"
              rx="4"
              fill={col === 3 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.03 }}
            />
          ))}
        </motion.g>

        {/* Growth chart */}
        <motion.g
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Chart bars */}
          {[
            { x: 60, height: 40 },
            { x: 80, height: 55 },
            { x: 100, height: 45 },
            { x: 60, height: 60, delay: 0.1 },
            { x: 80, height: 75, delay: 0.15 },
            { x: 100, height: 85, delay: 0.2 },
          ].slice(3).map((bar, i) => (
            <motion.rect
              key={i}
              x={bar.x}
              y={220 - bar.height}
              width="15"
              height={bar.height}
              rx="3"
              fill="url(#barGradient)"
              initial={{ height: 0, y: 220 }}
              animate={{ height: bar.height, y: 220 - bar.height }}
              transition={{ duration: 0.6, delay: 0.5 + (bar.delay || 0) }}
            />
          ))}

          {/* Growth arrow */}
          <motion.path
            d="M55 200 L75 170 L95 180 L115 140"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <motion.polygon
            points="115,140 125,145 120,155"
            fill="hsl(var(--primary))"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
          />
        </motion.g>

        {/* Floating coins */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <circle cx="310" cy="100" r="20" fill="hsl(var(--primary))" opacity="0.9" />
          <text x="310" y="106" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">R$</text>
        </motion.g>

        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
        >
          <circle cx="330" cy="140" r="15" fill="hsl(var(--primary))" opacity="0.7" />
          <text x="330" y="145" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">$</text>
        </motion.g>

        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
        >
          <circle cx="350" cy="170" r="12" fill="hsl(var(--primary))" opacity="0.5" />
        </motion.g>

        {/* Percentage badge */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.6 }}
        >
          <rect x="290" y="200" width="60" height="30" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text x="320" y="220" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">+35%</text>
        </motion.g>

        {/* Decorative dots */}
        {[
          { cx: 50, cy: 80, r: 4 },
          { cx: 70, cy: 60, r: 3 },
          { cx: 40, cy: 120, r: 5 },
          { cx: 360, cy: 80, r: 4 },
          { cx: 380, cy: 220, r: 3 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="hsl(var(--primary))"
            opacity={0.3}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  )
}
