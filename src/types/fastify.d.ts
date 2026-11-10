import type { users } from "../entity/users.entity.js";

type AuthenticatedUser = Pick<
  typeof users.$inferSelect,
  | "id"
  | "organization_id"
  | "role"
  | "name"
  | "email"
  | "tenant_id"
  | "must_change_password"
>;

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser | null;
  }
}