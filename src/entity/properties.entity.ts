import { pgTable,uuid,text,timestamp,boolean, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.entity.js";


export const bedLabelStyleEnum = pgEnum("bed_label_style", [
    "alpha",
    "numeric",
  ]);
export const properties=pgTable("properties",{
    id:uuid("id").defaultRandom().primaryKey(),
    organization_id:uuid("organization_id").notNull().references(()=>organizations.id),
    name:text("name").notNull(),
    area:text("area"),
    address:text("address"),
    city:text("city").notNull(),
    bed_label_style: bedLabelStyleEnum("bed_label_style").notNull().default("numeric"),
    is_active:boolean("is_active").notNull().default(true),
    created_at:timestamp("created_at", {
        withTimezone: true,
      })
        .defaultNow()
        .notNull(),
    updated_at:timestamp("updated_at", {
        withTimezone: true,
      })
        .defaultNow()
        .notNull(),
});