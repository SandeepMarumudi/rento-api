import "dotenv/config";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
    dialect: "postgresql",
    schema: "./src/entity/*.entity.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});