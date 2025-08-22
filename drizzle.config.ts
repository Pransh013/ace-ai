import { env } from "@/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./src/drizzle//migrations",
  schema: "./src/drizzle/schema.ts",
});
