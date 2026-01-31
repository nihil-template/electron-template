import { defineConfig } from 'drizzle-kit';

/**
 * 로컬 SQLite 스키마용 Drizzle Kit 설정.
 * 마이그레이션 생성: pnpm db:generate
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/main/server/schema/local/index.ts',
  out: './drizzle/local',
});
