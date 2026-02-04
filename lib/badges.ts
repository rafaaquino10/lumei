import { BadgeCategory } from '@prisma/client'

export interface BadgeDefinition {
  slug: string
  name: string
  description: string
  icon: string // Lucide icon name
  category: BadgeCategory
  points: number
  criteria: {
    type: string
    value?: number
    [key: string]: unknown
  }
}

export const BADGES: BadgeDefinition[] = [
  // ONBOARDING
  {
    slug: 'welcome',
    name: 'Bem-vindo!',
    description: 'Criou sua conta no Calcula MEI',
    icon: 'Sparkles',
    category: 'ONBOARDING',
    points: 5,
    criteria: { type: 'account_created' },
  },
  {
    slug: 'profile-complete',
    name: 'Perfil Completo',
    description: 'Preencheu todas as informacoes do perfil',
    icon: 'UserCheck',
    category: 'ONBOARDING',
    points: 10,
    criteria: { type: 'profile_complete' },
  },
  {
    slug: 'first-registration',
    name: 'Primeiro Registro',
    description: 'Registrou seu primeiro faturamento',
    icon: 'FileText',
    category: 'ONBOARDING',
    points: 15,
    criteria: { type: 'registrations_count', value: 1 },
  },

  // CONSISTENCY
  {
    slug: 'streak-7',
    name: 'Uma Semana',
    description: '7 dias consecutivos usando o app',
    icon: 'Flame',
    category: 'CONSISTENCY',
    points: 20,
    criteria: { type: 'streak_days', value: 7 },
  },
  {
    slug: 'streak-30',
    name: 'Um Mes',
    description: '30 dias consecutivos usando o app',
    icon: 'Flame',
    category: 'CONSISTENCY',
    points: 50,
    criteria: { type: 'streak_days', value: 30 },
  },
  {
    slug: 'streak-90',
    name: 'Trimestre',
    description: '90 dias consecutivos usando o app',
    icon: 'Flame',
    category: 'CONSISTENCY',
    points: 100,
    criteria: { type: 'streak_days', value: 90 },
  },
  {
    slug: 'streak-365',
    name: 'Veterano',
    description: '365 dias consecutivos usando o app',
    icon: 'Crown',
    category: 'CONSISTENCY',
    points: 500,
    criteria: { type: 'streak_days', value: 365 },
  },
  {
    slug: 'monthly-all-year',
    name: 'Ano Completo',
    description: 'Registrou faturamento em todos os 12 meses',
    icon: 'Calendar',
    category: 'CONSISTENCY',
    points: 200,
    criteria: { type: 'months_registered', value: 12 },
  },

  // MILESTONE
  {
    slug: 'first-10k',
    name: 'Primeiro 10K',
    description: 'Atingiu R$ 10.000 de faturamento no ano',
    icon: 'TrendingUp',
    category: 'MILESTONE',
    points: 25,
    criteria: { type: 'revenue_milestone', value: 10000 },
  },
  {
    slug: 'first-50k',
    name: 'Meio Caminho',
    description: 'Atingiu R$ 50.000 de faturamento no ano',
    icon: 'Target',
    category: 'MILESTONE',
    points: 75,
    criteria: { type: 'revenue_milestone', value: 50000 },
  },
  {
    slug: 'limit-reached',
    name: 'Limite MEI',
    description: 'Atingiu o limite de R$ 81.000',
    icon: 'Award',
    category: 'MILESTONE',
    points: 150,
    criteria: { type: 'revenue_milestone', value: 81000 },
  },

  // FINANCIAL
  {
    slug: 'calculator-explorer',
    name: 'Explorador',
    description: 'Usou 5 calculadoras diferentes',
    icon: 'Calculator',
    category: 'FINANCIAL',
    points: 30,
    criteria: { type: 'calculators_used', value: 5 },
  },
  {
    slug: 'calculator-master',
    name: 'Mestre das Calculadoras',
    description: 'Usou todas as calculadoras disponiveis',
    icon: 'Trophy',
    category: 'FINANCIAL',
    points: 100,
    criteria: { type: 'calculators_used', value: 10 },
  },
  {
    slug: 'pdf-exporter',
    name: 'Profissional',
    description: 'Exportou 10 relatorios em PDF',
    icon: 'FileDown',
    category: 'FINANCIAL',
    points: 40,
    criteria: { type: 'pdfs_exported', value: 10 },
  },

  // SOCIAL
  {
    slug: 'early-adopter',
    name: 'Early Adopter',
    description: 'Criou conta nos primeiros 30 dias do lancamento',
    icon: 'Rocket',
    category: 'SOCIAL',
    points: 100,
    criteria: { type: 'early_adopter' },
  },
  {
    slug: 'premium-member',
    name: 'Membro Premium',
    description: 'Assinou o plano Premium',
    icon: 'Crown',
    category: 'SPECIAL',
    points: 100,
    criteria: { type: 'premium_subscription' },
  },

  // SPECIAL
  {
    slug: 'night-owl',
    name: 'Coruja',
    description: 'Usou o app depois da meia-noite',
    icon: 'Moon',
    category: 'SPECIAL',
    points: 15,
    criteria: { type: 'night_usage' },
  },
  {
    slug: 'early-bird',
    name: 'Madrugador',
    description: 'Usou o app antes das 6h da manha',
    icon: 'Sun',
    category: 'SPECIAL',
    points: 15,
    criteria: { type: 'early_usage' },
  },
]

export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return BADGES.filter(b => b.category === category)
}

export function getBadgeBySlug(slug: string): BadgeDefinition | undefined {
  return BADGES.find(b => b.slug === slug)
}
