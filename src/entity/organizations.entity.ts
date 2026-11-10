import { pgTable,uuid,text,boolean,timestamp} from "drizzle-orm/pg-core";

export const organizations=pgTable("organizations",{
    id:uuid("id").defaultRandom().primaryKey(),
    name:text("name").notNull(),
    upi_id:text("upi_id"),
    staff_can_handle_payments:boolean("staff_can_handle_payments").notNull().default(true),
    staff_can_see_private_complaints:boolean("staff_can_see_private_complaints").notNull().default(false),
    receipt_prefix: text("receipt_prefix").default("RC").notNull(),
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
});