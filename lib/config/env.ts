import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key é obrigatória'),
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key é obrigatória'),
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error.message}`)
  }

  return result.data
}
