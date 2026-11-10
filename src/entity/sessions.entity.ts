import { pgTable, uuid, timestamp,text } from "drizzle-orm/pg-core";
import { users } from "./users.entity.js";

export const sessions=pgTable("sessions",{
    id:uuid("id").defaultRandom().primaryKey(),
    user_id:uuid("user_id").notNull().references(()=>users.id),
   session_token_hash: text("session_token_hash").notNull().unique(),
   revoked_at:timestamp("revoked_at", {
    withTimezone: true,
  }),
  user_agent:text("user_agent"),
    expires_at:timestamp("expires_at", {
        withTimezone: true,
      }).notNull(),
    created_at:timestamp("created_at", {
        withTimezone: true,
      }).defaultNow().notNull(),
})