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
    <div className="relative">
      {/* Main screenshot container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Image
              src={current.src}
              alt={`Calculadora ${current.title}`}
              width={600}
              height={400}
              className="w-full"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                ? 'bg-mei-500 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ver calculadora ${index + 1}`}
          />
        ))}
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <p className="text-sm font-bold text-mei-600">100% Gratuito</p>
      </motion.div>
    </div>
  )
}
