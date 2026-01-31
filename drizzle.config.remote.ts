import { defineConfig } from 'drizzle-kit';

/**
 * 원격 Postgres 스키마용 Drizzle Kit 설정.
 * 마이그레이션 생성: pnpm db:generate:remote
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/main/server/schema/remote/index.ts',
  out: './drizzle/remote',
});
