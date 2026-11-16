import type { FloorRequestDto } from "../dto/floors/floor.request.dto.js";
import { db } from "../database/database.js";
import { floors } from "../entity/floors.entity.js";
import { properties } from "../entity/properties.entity.js";
import { and, eq } from "drizzle-orm";
import type { UpdateFloorRequestDto } from "../dto/floors/update-floor.request.dto.js";


export const createFloor=async(data:FloorRequestDto,organizationId:string,propertyId:string)=>{
    try{
       const [property]=await db.select().from(properties).where(and(eq(properties.id,propertyId),eq(properties.organization_id,organizationId))).limit(1);
       if(!property){
        return null;
       }
       const floor=await db.insert(floors).values({...data,property_id: propertyId,
        organization_id: organizationId,}).returning();
        return floor;
    }catch(error){
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
          ) {
            throw new Error("FLOOR_ALREADY_EXISTS");
          }
      
          throw error;
    }
}

export const getFloors=async(organizationId:string,propertyId:string)=>{
  try{
    const [property]=await db.select().from(properties).where(and(eq(properties.id,propertyId),eq(properties.organization_id,organizationId))).limit(1);
    if(!property){
      return null;
    }
    const result=await db.select().from(floors).where(and(eq(floors.property_id,propertyId),eq(floors.organization_id,organizationId)));
    return result;
  }catch(error){
    throw error;
  }
}


export const updateFloor = async (
  data: UpdateFloorRequestDto,
  organizationId: string,
  floorId: string,
) => {
  const [updatedFloor] = await db
    .update(floors)
    .set(data)
    .where(
      and(
        eq(floors.id, floorId),
        eq(floors.organization_id, organizationId),
      ),
    )
    .returning();

  return updatedFloor ?? null;
};
