import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  S3_ENDPOINT: z.url(),
  S3_REGION: z.string().min(1).default("us-east-1"),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  TTS_BASE_URL: z.url(),
  TTS_API_KEY: z.string().optional(),
  TTS_MODEL: z.string().min(1),
  TTS_VOICE: z.string().min(1),
  TTS_SAMPLE_RATE: z.coerce.number().int().positive().default(24000),
  MP3_BITRATE: z.coerce.number().int().positive().default(64),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export function getEnv(): Env {
  cachedEnv ??= envSchema.parse(process.env);
  return cachedEnv;
}
