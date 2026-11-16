
import {
    pgTable,
    uuid,
    integer,
    text,
    boolean,
    unique,
  } from "drizzle-orm/pg-core";
  
  import { organizations } from "./organizations.entity.js";
  import { properties } from "./properties.entity.js";
  
  export const floors = pgTable(
    "floors",
    {
      id: uuid("id").defaultRandom().primaryKey(),
  
      organization_id: uuid("organization_id")
        .notNull()
        .references(() => organizations.id),
  
      property_id: uuid("property_id")
        .notNull()
        .references(() => properties.id),
  
      number: integer("number").notNull(),
  
      label: text("label").notNull(),
  
      is_active: boolean("is_active").notNull().default(true),
    },
    (table) => [
      unique("floors_property_number_unique").on(
        table.property_id,
        table.number,
      ),
    ],
  );
  