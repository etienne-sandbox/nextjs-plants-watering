import { withIronSessionApiRoute } from "iron-session/next";
import { findPlantById, removePlant } from "../../database";
import { sessionConfig } from "../../logic/session";
import { z } from "zod";
import { unauthorized } from "../../logic/utils";

/**
 * Supprimé une plante
 */

const bodySchema = z.strictObject({
  plantId: z.string(),
});

export default withIronSessionApiRoute(async function handler(req, res) {
  if (!req.session.user) {
    return unauthorized(res);
  }
  const parsed = bodySchema.safeParse(req.body);
  if (parsed.success === false) {
    return res.status(400).json({
      status: 400,
      message: "Body validation error",
      error: "body-validation-error",
      zodErrors: parsed.error.errors,
    });
  }
  const data = parsed.data;
  const { plantId } = data;
  const plant = await findPlantById(plantId);
  if (!plant) {
    return res.status(404).json({
      status: 404,
      message: "Plant not found",
      error: "plant-not-found",
    });
  }
  await removePlant(plantId);
  return res.status(201).end();
}, sessionConfig);
