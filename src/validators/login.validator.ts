import {z} from "zod";

export const loginValidator=z.object({
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    password:z.string().min(1, "Password is required"),
}).strict();
export type LoginValidatorType = z.infer<typeof loginValidator>;