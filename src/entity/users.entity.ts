import {pgTable,uuid,text,boolean,timestamp,foreignKey,pgEnum,varchar} from "drizzle-orm/pg-core";
import { organizations } from "./organizations.entity.js";

export const userRoleEnum = pgEnum("user_role", [
    "owner",
    "staff",
    "tenant",
  ]);


export const users=pgTable("users",{
    id:uuid("id").defaultRandom().primaryKey(),
    organization_id:uuid("organization_id").notNull().references(()=>organizations.id),
    role:userRoleEnum("role").notNull(),
    name:text("name").notNull(),
    email:varchar("email",{length:255}).notNull().unique(),
    phone:varchar("phone",{length:20}),
    password_hash:text("password_hash").notNull(),
    tenant_id:uuid("tenant_id"),
    is_active: boolean("is_active").default(true).notNull(),
    must_change_password: boolean("must_change_password")
    .default(false)
    .notNull(),

  last_login_at: timestamp("last_login_at", {
    withTimezone: true,
  }),

  created_at: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updated_at: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
    })