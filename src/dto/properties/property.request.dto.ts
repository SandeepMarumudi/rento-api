import type z from "zod";
import { propertyValidator, type PropertyValidatorType } from "../../validators/property.validator.js";

export type PropertyRequestDto = PropertyValidatorType;

export const UpdatePropertyRequestDto = propertyValidator.partial()
.refine((data)=>Object.keys(data).length>0, "At least one field is required");
export type UpdatePropertyRequestDto = z.infer<typeof UpdatePropertyRequestDto>;