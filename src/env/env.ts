import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  BASE_URL: z.string().url().default('http://localhost:3333'),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENABLED: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>
