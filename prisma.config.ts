import { defineConfig } from "prisma/config";

function loadEnvFileIfPresent() {
  try {
    process.loadEnvFile();
  } catch {}
}

loadEnvFileIfPresent();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
