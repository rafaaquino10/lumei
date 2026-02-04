'use client'

import { motion } from 'framer-motion'

/**
 * Ilustração para seção de Alertas DAS
 * Conceito: Sino + calendário = nunca esqueça suas obrigações
 */
export function AlertasIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="alertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="url(#alertGradient)"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Calendar base */}
        <motion.g
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <rect
            x="50"
            y="70"
            width="100"
            height="90"
            rx="8"
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          {/* Calendar header */}
          <rect
            x="50"
            y="70"
            width="100"
            height="25"
            rx="8"
            fill="hsl(var(--primary))"
          />
          <rect
            x="50"
            y="87"
            width="100"
            height="8"
            fill="hsl(var(--primary))"
          />
          {/* Calendar rings */}
          <rect x="70" y="65" width="8" height="15" rx="2" fill="hsl(var(--muted))" />
          <rect x="122" y="65" width="8" height="15" rx="2" fill="hsl(var(--muted))" />
          {/* Day "20" highlighted */}
          <rect x="95" y="115" width="30" height="25" rx="4" fill="hsl(var(--primary))" opacity="0.2" />
          <text x="110" y="133" textAnchor="middle" fill="hsl(var(--primary))" fontSize="14" fontWeight="bold">20</text>
          {/* Other days */}
          <text x="70" y="115" fill="hsl(var(--muted-foreground))" fontSize="10">14</text>
          <text x="90" y="115" fill="hsl(var(--muted-foreground))" fontSize="10">15</text>
          <text x="130" y="115" fill="hsl(var(--muted-foreground))" fontSize="10">21</text>
          <text x="70" y="145" fill="hsl(var(--muted-foreground))" fontSize="10">22</text>
          <text x="90" y="145" fill="hsl(var(--muted-foreground))" fontSize="10">23</text>
          <text x="110" y="145" fill="hsl(var(--muted-foreground))" fontSize="10">24</text>
          <text x="130" y="145" fill="hsl(var(--muted-foreground))" fontSize="10">25</text>
        </motion.g>

        {/* Bell notification */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.4 }}
        >
          <circle cx="145" cy="55" r="25" fill="hsl(var(--primary))" />
          {/* Bell icon */}
          <path
            d="M145 45c-5 0-9 4-9 9v6l-3 3v2h24v-2l-3-3v-6c0-5-4-9-9-9z"
            fill="white"
          />
          <circle cx="145" cy="68" r="3" fill="white" />
        </motion.g>

        {/* Notification waves */}
        <motion.circle
          cx="145"
          cy="55"
          r="30"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.3"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </svg>
    </div>
  )
}

/**
 * Ilustração para seção Premium
 * Conceito: Estrela/diamante = exclusividade e valor
 */
export function PremiumIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>

        {/* Background glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="70"
          fill="hsl(var(--primary))"
          opacity="0.1"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        {/* Crown */}
        <motion.g
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <path
            d="M60 120 L75 70 L100 95 L125 70 L140 120 Z"
            fill="url(#goldGradient)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          {/* Crown jewels */}
          <circle cx="75" cy="85" r="6" fill="hsl(var(--primary))" />
          <circle cx="100" cy="75" r="8" fill="hsl(var(--primary))" />
          <circle cx="125" cy="85" r="6" fill="hsl(var(--primary))" />
          {/* Crown base */}
          <rect x="60" y="120" width="80" height="15" rx="3" fill="url(#goldGradient)" stroke="hsl(var(--primary))" strokeWidth="2" />
        </motion.g>

        {/* Sparkles */}
        {[
          { cx: 45, cy: 60, delay: 0 },
          { cx: 155, cy: 65, delay: 0.3 },
          { cx: 50, cy: 140, delay: 0.6 },
          { cx: 150, cy: 145, delay: 0.9 },
        ].map((spark, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: spark.delay }}
          >
            <path
              d={`M${spark.cx} ${spark.cy - 8} L${spark.cx} ${spark.cy + 8} M${spark.cx - 8} ${spark.cy} L${spark.cx + 8} ${spark.cy}`}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>
        ))}

        {/* Badge */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.5 }}
        >
          <circle cx="100" cy="160" r="20" fill="hsl(var(--primary))" />
          <path
            d="M92 160 L98 166 L110 154"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </svg>
    </div>
  )
}

/**
 * Ilustração para seção de Segurança
 * Conceito: Escudo + cadeado = dados protegidos
 */
export function SegurancaIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Background */}
        <motion.circle
          cx="100"
          cy="100"
          r="75"
          fill="hsl(var(--primary))"
          opacity="0.1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Shield */}
        <motion.path
          d="M100 35 L155 55 L155 100 C155 140 100 170 100 170 C100 170 45 140 45 100 L45 55 Z"
          fill="url(#shieldGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* Shield inner */}
        <motion.path
          d="M100 50 L145 67 L145 100 C145 132 100 155 100 155 C100 155 55 132 55 100 L55 67 Z"
          fill="hsl(var(--card))"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />

        {/* Lock */}
        <motion.g
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Lock body */}
          <rect
            x="80"
            y="95"
            width="40"
            height="35"
            rx="5"
            fill="hsl(var(--primary))"
          />
          {/* Lock shackle */}
          <path
            d="M85 95 L85 80 C85 70 100 65 100 65 C100 65 115 70 115 80 L115 95"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Keyhole */}
          <circle cx="100" cy="108" r="5" fill="hsl(var(--card))" />
          <rect x="98" y="108" width="4" height="10" fill="hsl(var(--card))" />
        </motion.g>

        {/* Checkmark badge */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.8 }}
        >
          <circle cx="140" cy="145" r="18" fill="hsl(var(--primary))" />
          <path
            d="M132 145 L138 151 L150 139"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </svg>
    </div>
  )
}

/**
 * Ilustração para seção de Histórico
 * Conceito: Relógio + gráfico = acompanhe sua evolução
 */
export function HistoricoIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="histGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>

        {/* Background */}
        <motion.rect
          x="30"
          y="50"
          width="140"
          height="120"
          rx="10"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Chart bars */}
        {[
          { x: 50, height: 40, delay: 0.2 },
          { x: 80, height: 60, delay: 0.3 },
          { x: 110, height: 50, delay: 0.4 },
          { x: 140, height: 80, delay: 0.5 },
        ].map((bar, i) => (
          <motion.rect
            key={i}
            x={bar.x}
            y={150 - bar.height}
            width="20"
            height={bar.height}
            rx="4"
            fill="url(#histGradient)"
            initial={{ height: 0, y: 150 }}
            animate={{ height: bar.height, y: 150 - bar.height }}
            transition={{ delay: bar.delay, duration: 0.5 }}
          />
        ))}

        {/* Trend line */}
        <motion.path
          d="M55 130 L90 110 L120 118 L150 85"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        />

        {/* Clock overlay */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.9 }}
        >
          <circle cx="155" cy="45" r="25" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="3" />
          <circle cx="155" cy="45" r="20" fill="hsl(var(--card))" />
          {/* Clock hands */}
          <motion.line
            x1="155"
            y1="45"
            x2="155"
            y2="32"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
            style={{ transformOrigin: '155px 45px' }}
          />
          <motion.line
            x1="155"
            y1="45"
            x2="165"
            y2="45"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            style={{ transformOrigin: '155px 45px' }}
          />
          <circle cx="155" cy="45" r="3" fill="hsl(var(--primary))" />
        </motion.g>

        {/* Data points */}
        {[
          { cx: 55, cy: 130 },
          { cx: 90, cy: 110 },
          { cx: 120, cy: 118 },
          { cx: 150, cy: 85 },
        ].map((point, i) => (
          <motion.circle
            key={i}
            cx={point.cx}
            cy={point.cy}
            r="5"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--card))"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * Ícones específicos para cada calculadora
 */
export function CalculadoraIcon({
  tipo,
  className = '',
  size = 48
}: {
  tipo: 'margem' | 'hora' | 'preco' | 'faturamento' | 'fluxo' | 'das'
  className?: string
  size?: number
}) {
  const icons = {
    margem: (
      // Gráfico de pizza para margem de lucro
      <svg viewBox="0 0 48 48" fill="none" className={className} width={size} height={size}>
        <circle cx="24" cy="24" r="20" fill="hsl(var(--muted))" />
        <motion.path
          d="M24 4 A20 20 0 0 1 44 24 L24 24 Z"
          fill="hsl(var(--primary))"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: '24px 24px' }}
        />
        <circle cx="24" cy="24" r="8" fill="hsl(var(--card))" />
      </svg>
    ),
    hora: (
      // Relógio para preço por hora
      <svg viewBox="0 0 48 48" fill="none" className={className} width={size} height={size}>
        <circle cx="24" cy="24" r="20" fill="hsl(var(--muted))" stroke="hsl(var(--primary))" strokeWidth="2" />
        <motion.line
          x1="24" y1="24" x2="24" y2="12"
          stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: '24px 24px' }}
        />
        <motion.line
          x1="24" y1="24" x2="32" y2="24"
          stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ transformOrigin: '24px 24px' }}
        />
        <circle cx="24" cy="24" r="3" fill="hsl(var(--primary))" />
        <text x="24" y="40" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8" fontWeight="bold">R$</text>
      </svg>
    ),
    preco: (
      // Tag de preço
      <svg viewBox="0 0 48 48" fill="none" className={className} width={size} height={size}>
        <motion.path
          d="M8 24 L24 8 L40 8 L40 24 L24 40 Z"
          fill="hsl(var(--primary))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        />
        <circle cx="32" cy="16" r="4" fill="hsl(var(--card))" />
        <path d="M16 22 L22 28 M22 22 L16 28" stroke="hsl(var(--card))" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    faturamento: (
      // Gráfico de barras crescente
      <svg viewBox="0 0 48 48" fill="none" className={className} width={size} height={size}>
        {[
          { x: 6, h: 16 },
          { x: 16, h: 24 },
          { x: 26, h: 20 },
          { x: 36, h: 32 },
        ].map((bar, i) => (
          <motion.rect
            key={i}
            x={bar.x}
            y={40 - bar.h}
            width="8"
            height={bar.h}
            rx="2"
            fill={i === 3 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            initial={{ height: 0, y: 40 }}
            animate={{ height: bar.h, y: 40 - bar.h }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        <path d="M4 12 L12 20 L24 16 L44 6" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
    fluxo: (
      // Setas de entrada e saída
      <svg viewBox="0 0 48 48" fill="none" className={className} width={size} height={size}>
        <rect x="16" y="8" width="16" height="32" rx="4" fill="hsl(var(--muted))" />
        <motion.g
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <path d="M4 18 L14 18" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
          <path d="M10 14 L14 18 L10 22" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>
        <motion.g
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <path d="M34 30 L44 30" stroke="hsl(var(--destructive, var(--primary)))" strokeWidth="3" strokeLinecap="round" />
          <path d="M38 26 L34 30 L38 34" stroke="hsl(var(--destructive, var(--primary)))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>
        <text x="24" y="26" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">R$</text>
      </svg>
    ),
    das: (
      // Calendário com check
      <svg viewBox="0 0 48 48" fill="none" className={className} width={size} height={size}>
        <rect x="6" y="10" width="36" height="32" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        <rect x="6" y="10" width="36" height="10" rx="4" fill="hsl(var(--primary))" />
        <rect x="6" y="17" width="36" height="3" fill="hsl(var(--primary))" />
        <rect x="14" y="6" width="4" height="8" rx="2" fill="hsl(var(--muted))" />
        <rect x="30" y="6" width="4" height="8" rx="2" fill="hsl(var(--muted))" />
        <motion.path
          d="M18 30 L22 34 L30 26"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </svg>
    ),
  }

  return icons[tipo] || null
}
