import { and, eq } from "drizzle-orm";
import { db } from "../database/database.js";
import type { PropertyRequestDto, UpdatePropertyRequestDto } from "../dto/properties/property.request.dto.js";
import { properties } from "../entity/properties.entity.js";

export const createProperty=async(data:PropertyRequestDto,organizationId:string)=>{
    try{
        const [property]=await db.insert(properties).values({...data,organization_id:organizationId}).returning();
        return property;
    }catch(error){
        throw new Error("Failed to create property");
    }

}

export const getProperties=async(organizationId:string)=>{
    try{
        const result=await db.select().from(properties).where(eq(properties.organization_id,organizationId));
        return result;
    }catch(error){
        throw new Error("Failed to get properties");
    }
}

export const getPropertyById=async(propertyId:string,organizationId:string)=>{
    try{
        const result=await db.select().from(properties).where(and(eq(properties.id,propertyId),eq(properties.organization_id,organizationId)));
        return result;
    }catch(error){
        throw new Error("Failed to get property by id");
    }
}

export const updateProperty=async(propertyId:string,data:UpdatePropertyRequestDto,organizationId:string)=>{
    try{
        const result=await db.update(properties).set({...data}).where(and(eq(properties.id,propertyId),eq(properties.organization_id,organizationId)));
        return result;
    }catch(error){
        throw new Error("Failed to update property");
    }
}

