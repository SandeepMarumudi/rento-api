import { z } from "zod";

export const registerOwnerValidator = z.object({
  organizationName: z.string().trim().min(1),

  ownerName: z.string().trim().min(1),

  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),

  password: z.string().min(8),

  phone: z.string().trim().optional(),
});

export type RegisterOwnerValidatorType = z.infer<
  typeof registerOwnerValidator
>;