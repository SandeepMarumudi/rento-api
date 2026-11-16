import { z } from "zod";

export const floorValidator=z.object({
    number:z.number().int().min(0,"Floor number cannot be negative"),
    label:z.string().trim().min(1,"Floor label required"),
})
export type FloorValidatorType=z.infer<typeof floorValidator>;

export const updateFloorValidator =z.object({
    label:z.string()
    .trim()
    .min(1, "Floor label is required")
    .max(40, "Floor label cannot exceed 40 characters"),
})
export type UpdateFloorValidatorType = z.infer<
  typeof updateFloorValidator
>;