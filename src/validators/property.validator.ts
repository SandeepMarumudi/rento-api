import { z } from "zod";

export const propertyValidator=z.object({
    name: z.string().trim().min(1, "Name is required"),
    city: z.string().trim().min(1, "City is required"),
    area:z.string().optional(),
    address:z.string().optional(),
    bed_label_style: z.enum(["alpha", "numeric"]).optional(),
});
export type PropertyValidatorType = z.infer<typeof propertyValidator>;