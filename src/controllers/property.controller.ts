import { authenticate } from "../middlewares/auth.middleware.js";
import type { FastifyPluginAsync } from "fastify";
import { propertyValidator } from "../validators/property.validator.js";
import { createProperty, getProperties, getPropertyById, updateProperty } from "../services/property.service.js";
import { UpdatePropertyRequestDto } from "../dto/properties/property.request.dto.js";

export const propertyController: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/properties",
    { preHandler: authenticate },
    async (request, reply) => {
      if (!request.user) {
        return reply.status(401).send({
          message: "Authentication required",
          code: "UNAUTHENTICATED",
        });
      }

      const validatedData = propertyValidator.safeParse(request.body);
      if (!validatedData.success) {
        return reply.status(400).send({
          message: "Invalid property details",
          errors: validatedData.error.flatten(),
        });
      }

      const property = await createProperty(
        validatedData.data,
        request.user.organization_id,
      );

      return reply.status(201).send({
        status: 201,
        message: "Property created successfully",
        data: property,
        errors: [],
      });
    },
  );
  fastify.get("/properties",{preHandler:authenticate},async (request,reply) => {
    if(!request.user){
      return reply.status(401).send({
        message: "Authentication required",
        code:"UNAUTHORIZED",
      });
    }
    const properties=await getProperties(request.user.organization_id);
    return reply.status(200).send({
      status: 200,
      message: "Properties fetched successfully",
      data: properties,
      errors: [],
    });
  });

  fastify.get("/properties/:id",{preHandler:authenticate},async (request,reply) => {
    if(!request.user){
      return reply.status(401).send({
        message: "Authentication required",
        code:"UNAUTHORIZED",
      });
    }
    const { id } = request.params as { id: string };
      const property=await getPropertyById(id,request.user.organization_id);
      return reply.status(200).send({
        status: 200,
        message: "Property fetched successfully",
        data: property,
        errors: [],
      });
    },
  );
  fastify.patch("/properties/:id",{preHandler:authenticate},async (request,reply) => {
    if(!request.user){
      return reply.status(401).send({
        message: "Authentication required",
        code:"UNAUTHORIZED",
      });
    }
    const { id } = request.params as { id: string };
    const validatedData = UpdatePropertyRequestDto.safeParse(request.body);
    if (!validatedData.success) {
      return reply.status(400).send({
        message: "Invalid property details",
        errors: validatedData.error.flatten(),
      });
    }
    const result =await updateProperty(id,validatedData.data,request.user.organization_id);
    return reply.status(200).send({
      status: 200,
      message: "Property updated successfully",
      data: result,
      errors: [],
    });
 
  });
};