import {db} from "../database/database.js";
import { sql } from "drizzle-orm";

export async function getTestConnectionName(){
    const result = await db.execute(
        sql`SELECT current_database() AS database_name`,
      );
      return result
}

