/**
 * Токен deeptalk STT/TTS не хранится в репозитории.
 * Локально: скопируйте .env.example → .env и задайте DEEPTALK_API_TOKEN.
 * CI/сборка: export DEEPTALK_API_TOKEN=... перед npm run build
 */
export function getDeeptalkApiToken(): string {
  const env = typeof process !== 'undefined' ? (process as { env?: Record<string, string | undefined> }).env : undefined;
  const v = env?.DEEPTALK_API_TOKEN;
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : '';
}
