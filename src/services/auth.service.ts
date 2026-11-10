import { eq } from "drizzle-orm";
import { db } from "../database/database.js";
import {users} from "../entity/users.entity.js";
import {organizations} from "../entity/organizations.entity.js";
import { hashPassword } from "../utils/password.utils.js";
import type {RegisterOwnerRequestDto} from "../dto/auth/auth.request.dto.js";
import type { LoginRequestDto } from "../dto/auth/login.request.dto.js";
import {verifyPassword} from "../utils/password.utils.js";
import { createHash, randomBytes } from "node:crypto";
import { sessions } from "../entity/sessions.entity.js";

const isUniqueViolation = (error: unknown): boolean => {
    if (typeof error !== "object" || error === null) {
      return false;
    }
  
    if ("code" in error && error.code === "23505") {
      return true;
    }
  
    if ("cause" in error) {
      return isUniqueViolation(error.cause);
    }
  
    return false;
  };

export const registerOwner = async (data:RegisterOwnerRequestDto) => {
 const passwordHash = await hashPassword(data.password); 
 try{

     return await db.transaction(async (tx) => {
         const [organization] = await tx.insert(organizations).values({
             name:data.organizationName,
         }).returning();
        
         const [owner] = await tx
         .insert(users)
         .values({
           organization_id: organization?.id ?? "",
           role: "owner",
           name: data.ownerName,
           email: data.email,
           phone: data.phone,
           password_hash: passwordHash,  
         })
         .returning();
         return {
            organization: {
                id: organization?.id ?? "",
                name: organization?.name ?? "",
              },
              owner: {
                id: owner?.id ?? "",
                name: owner?.name ?? "",
                email: owner?.email ?? "",
                phone: owner?.phone ?? "",
                role: owner?.role ?? "",
              },
         }
     })  
 } catch (error) {
    if (isUniqueViolation(error)) {
        throw new Error("User already exists");
    }
    throw error;
 }
}

export const login = async (data: LoginRequestDto) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

      if(!user){
        throw new Error("Invalid credentials");
      }
      const isPasswordValid = await verifyPassword(data.password, user.password_hash);
      if(!isPasswordValid){
        throw new Error("Entered password is incorrect");
      }
      if (!user.is_active) {
        throw new Error("Account is inactive");
      }
      const sessionToken = randomBytes(32).toString("hex");
      const sessionTokenHash = createHash("sha256").update(sessionToken).digest("hex");
      const sessionExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      );
      await db.insert(sessions).values({
        user_id: user.id,
        session_token_hash: sessionTokenHash,
        expires_at: sessionExpiresAt,
      });
      return {
        sessionToken,
        user: {
          id: user.id,
          organization_id: user.organization_id,
          name: user.name,
          email: user.email,
          role: user.role,
          must_change_password: user.must_change_password,
        },
      };
  };

export const logout =async(sessionToken:string) => {
    const hashedToken=createHash("sha256").update(sessionToken).digest("hex")
    await db.update(sessions).set({
        revoked_at:new Date(),
    }).where(eq(sessions.session_token_hash,hashedToken))
    
  }