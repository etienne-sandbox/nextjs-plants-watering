import { withIronSessionApiRoute } from "iron-session/next";
import { findPlantById, insertPlant, updatePlantById } from "../../database";
import { sessionConfig } from "../../logic/session";
import { z } from "zod";
import { unauthorized } from "../../logic/utils";

/**
 * Créé ou mettre à jour une plante
 */

const bodySchema = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  species: z.string(),
  frequency: z.number().int().min(1),
});

export default withIronSessionApiRoute(async function handler(req, res) {
  if (!req.session.user) {
    return unauthorized(res);
  }
  const parsed = bodySchema.safeParse(req.body);
  if (parsed.success === false) {
    res.status(400).json({
      status: 400,
      message: "Body validation error",
      error: "body-validation-error",
      zodError: parsed.error.errors,
    });
    return;
  }
  const data = parsed.data;
  const { species, frequency, name } = data;
  if (data.id) {
    // update
    const plant = await findPlantById(data.id);
    if (!plant) {
      return res.status(404).json({
        status: 404,
        message: "Plant not found",
        error: "plant-not-found",
      });
    }
    await updatePlantById(data.id, { species, frequency, name });
    return res.status(204).end();
  }
  // create
  await insertPlant({ species, frequency, name });
  return res.status(201).end();
}, sessionConfig);
