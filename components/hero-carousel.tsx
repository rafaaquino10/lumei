'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const screenshots = [
  {
    id: 'margem-lucro',
    title: 'Margem de Lucro',
    description: 'Descubra quanto você lucra',
    src: '/screenshots/margem-lucro.png',
  },
  {
    id: 'preco-hora',
    title: 'Preço por Hora',
    description: 'Calcule seu valor/hora',
    src: '/screenshots/preco-hora.png',
  },
  {
    id: 'precificacao',
    title: 'Precificação',
    description: 'Defina preços ideais',
    src: '/screenshots/precificacao.png',
  },
  {
    id: 'das',
    title: 'Calendário DAS',
    description: 'Nunca atrase o pagamento',
    src: '/screenshots/das.png',
  },
]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const current = screenshots[currentIndex]

  return (
    <div className="relative w-full">
      {/* Main screenshot container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card aspect-video">
        <AnimatePresence mode="sync">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={`Calculadora ${current.title}`}
              width={900}
              height={600}
              className="w-full h-full object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <AnimatePresence mode="sync">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white font-semibold">{current.title}</p>
              <p className="text-white/80 text-sm">{current.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Ver calculadora ${index + 1}`}
          />
        ))}
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-4 -right-4 bg-card rounded-lg shadow-lg p-3 border border-border"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <p className="text-sm font-bold text-primary">100% Gratuito</p>
      </motion.div>
    </div>
  )
}
