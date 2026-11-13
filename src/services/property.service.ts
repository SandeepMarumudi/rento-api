import { eq } from "drizzle-orm";
import { db } from "../database/database.js";
import type { PropertyRequestDto } from "../dto/properties/property.request.dto.js";
import { properties } from "../entity/properties.entity.js";

export const createProperty=async(data:PropertyRequestDto,organizationId:string)=>{
    try{
        const [property]=await db.insert(properties).values({...data,organization_id:organizationId}).returning();
        return property;
    }catch(error){
        throw new Error("Failed to create property");
    }

}