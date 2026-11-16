import type { FastifyPluginAsync } from "fastify";
import { authenticate } from "../middlewares/auth.middleware.js";
import { floorValidator, updateFloorValidator } from "../validators/floor.validator.js";
import { createFloor, getFloors, updateFloor } from "../services/floor.service.js";


export const floorController: FastifyPluginAsync = async (Fastify) => {

    Fastify.post("/properties/:id/floors",{preHandler:authenticate},async (request,reply) => {
        if (!request.user) {
            return reply.status(401).send({
              status: 401,
              message: "Unauthorized",
              data: null,
              errors: [],
            });
          }
          const { id } = request.params as { id: string };
       const validatedData =await floorValidator.safeParse(request.body);
       if(!validatedData.success){
        return reply.status(400).send({
            status: 400,
            message: "Validation Failed",
            data: null,
            errors: validatedData.error.issues,
          });
       }
      
       try {
        const floor = await createFloor(
          validatedData.data,
          request.user.organization_id,
          id,
        );
      
        if (!floor) {
          return reply.status(404).send({
            status: 404,
            message: "Property not found",
            data: null,
            errors: [],
          });
        }
      
        return reply.status(201).send({
          status: 201,
          message: "Floor created successfully",
          data: floor,
          errors: [],
        });
      } catch (error) {
        if (error instanceof Error && error.message === "FLOOR_ALREADY_EXISTS") {
          return reply.status(409).send({
            status: 409,
            message: "A floor with this number already exists in this property",
            data: null,
            errors: [],
          });
        }
      
        throw error;
      }
    });

    Fastify.get("/properties/:id/floors",{preHandler:authenticate},async (request,reply) => {
      if (!request.user) {
        return reply.status(401).send({
          status: 401,
          message: "Unauthorized",
          data: null,
          errors: [],
        });
      }
      const { id } = request.params as { id: string };

      const result = await getFloors(
        request.user.organization_id,
        id,
      );
      if (!result) {
        return reply.status(404).send({
          status: 404,
          message: "Property not found",
          data: null,
          errors: [],
        });
      }
      return reply.status(200).send({
        status: 200,
        message: "Floors retrieved successfully",
        data: result,
        errors: [],
      });
  
    })
    
 
    Fastify.patch(
  "/floors/:id",
  {
    preHandler: [authenticate],
  },
  async (request, reply) => {
    if (!request.user) {
      return reply.status(401).send({
        status: 401,
        message: "Unauthorized",
        data: null,
        errors: [],
      });
    }

    const { id } = request.params as { id: string };

    const validatedData = updateFloorValidator.safeParse(request.body);

    if (!validatedData.success) {
      return reply.status(400).send({
        status: 400,
        message: "Invalid request data",
        data: null,
        errors: validatedData.error.issues,
      });
    }

    const floor = await updateFloor(
      validatedData.data,
      request.user.organization_id,
      id,
    );

    if (!floor) {
      return reply.status(404).send({
        status: 404,
        message: "Floor not found",
        data: null,
        errors: [],
      });
    }

    return reply.status(200).send({
      status: 200,
      message: "Floor updated successfully",
      data: floor,
      errors: [],
    });
  },
);

    
  
}
