import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres'),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key é obrigatória'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PRODUCT_ID_PREMIUM: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL deve ser uma URL válida').optional(),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error.message}`)
  }

  return result.data
}
