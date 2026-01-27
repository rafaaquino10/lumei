'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const trustBadges = [
  { text: 'Sem cadastro', icon: Check },
  { text: '100% grátis', icon: Check },
  { text: 'Resultados agora', icon: Check },
]

export default function Home() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Lucre mais.
                <br />
                <span className="text-lumei-600">Sempre.</span>
              </h1>
              <p className="text-xl text-gray-600 sm:text-2xl">
                Calculadoras financeiras feitas para MEI crescer.
              </p>
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="group h-14 bg-lumei-500 px-8 text-lg font-semibold text-white shadow-lumei transition-all hover:bg-lumei-600 hover:shadow-lumei-lg"
                asChild
              >
                <Link href="/calculadoras">
                  Calcular Grátis
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6">
              {trustBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <Icon className="h-4 w-4 text-lumei-600" />
                    <span>{badge.text}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right Column - Placeholder for Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-lumei-50 to-lumei-100 shadow-2xl lg:h-[500px]">
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-lg font-medium text-gray-400">
                  Screenshot do produto
                </p>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lumei-200/50 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-lumei-300/50 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
