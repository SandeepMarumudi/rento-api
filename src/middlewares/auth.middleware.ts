import type{preHandlerHookHandler} from 'fastify'
import {createHash} from 'node:crypto'
import {eq} from "drizzle-orm"
import {db} from "../database/database.js"
import { sessions } from "../entity/sessions.entity.js"
import { users } from "../entity/users.entity.js"

export const authenticate:preHandlerHookHandler = async (request,reply,done) => {
    const sessionToken = request.cookies.session
    if(!sessionToken){
        return reply.status(401).send({message: "Authentication required",code:"UNAUTHENTICATED"})
    }
    const hashedToken = createHash('sha256').update(sessionToken).digest('hex')

    const [session]=await db.select().from(sessions).where(eq(sessions.session_token_hash,hashedToken))
    if(!session){
        return reply.status(401).send({
            message: "Invalid session",
            code: "INVALID_SESSION"
        })
    }
    if (session.expires_at <= new Date()) {
        return reply.status(401).send({
          message: "Session expired",
          code: "SESSION_EXPIRED",
        });
      }
      if (session.revoked_at !== null) {
        return reply.status(401).send({
          message: "Session has been revoked",
          code: "SESSION_REVOKED",
        });
      }

      const [user]=await db.select().from(users).where(eq(users.id,session.user_id)).limit(1)
      if (!user || !user.is_active) {
        return reply.status(401).send({
          message: "User is not available",
          code: "USER_UNAVAILABLE",
        });
      }

      request.user = {
        id: user.id,
        organization_id: user.organization_id,
        role: user.role,
        name: user.name,
        email: user.email,
        tenant_id: user.tenant_id,
        must_change_password: user.must_change_password,
      };
     
}