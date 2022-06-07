import { dirname, resolve } from "node:path";
import { db, createId } from "./connexion.js";
import { addDays, differenceInCalendarDays, format, set } from "date-fns";
import { writeJson, readJson, existsSync, ensureDir } from "fs-extra";

/**
 * Récupère la date virtuelle actuelle (voir le chapitre "Time Travel" du README)
 * @returns {Promise<string>} la date au format ISO
 */
export async function today() {
  const configFile = resolve("data", "config.json");
  if (!existsSync(configFile)) {
    await ensureDir(resolve("data"));
    await writeJson(configFile, { today: new Date().toISOString() });
  }
  const config = await readJson(configFile);
  // Update to current time
  const today = new Date(config.today);
  const now = new Date();
  const todayNow = set(today, {
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });
  return todayNow.toISOString();
}

/**
 * Chnage la date virtuelle au lendemain (voir le chapitre "Time Travel" du README)
 * @returns {Promise<string>} la date au format ISO
 */
export async function goToNextDay() {
  const configFile = resolve("data", "config.json");
  const currentDay = await today();
  const nextDay = addDays(new Date(currentDay), 1);
  await ensureDir(resolve("data"));
  await writeJson(configFile, { today: nextDay.toISOString() });
  return nextDay;
}

/**
 * L'utilisateur de l'application.
 * On utilise des données statiques pour simplifier le code.
 */
const USER = { username: "user", password: "pass" };

/**
 * Permet d'authentifier un utilisateur
 * @param {string} username
 * @param {string} password
 * @returns {false | { username: string,  password: string }}
 */
export async function findUser(username, password) {
  if (username === USER.username && password === USER.password) {
    return USER;
  }
  return null;
}

/**
 * @typedef {{
 *   id: string;
 *   name: string;
 *   species: string;
 *   frequency: number;
 *   createdAt: Date;
 * }} Plant
 */

/**
 * Récupère la liste des plantes avec le nombre de jours avant le prochain arrosage
 * @returns {Promise<Array<Plant & { nextWatering: number }>>}
 */
export async function findAllPlants() {
  await today();
  const d = await db;
  const plants = await d.select("*").from("plants").orderBy("createdAt");
  for await (const plant of plants) {
    plant.nextWatering = await computePlantNextWatering(plant);
  }
  return plants;
}

/**
 * Calcule le prochain arrosage d'une plante
 * @param {Plant} plant
 * @returns {Promise<number>}
 */
export async function computePlantNextWatering(plant) {
  const d = await db;
  const lastWatering = await d
    .select("date")
    .from("watering")
    .where("plantId", plant.id)
    .orderBy("date", "desc")
    .limit(1)
    .first();
  const lastWateringDate = lastWatering ? lastWatering.date : plant.createdAt;
  const nextWateringDate = addDays(lastWateringDate, plant.frequency);
  const currentDay = await today();
  return differenceInCalendarDays(nextWateringDate, new Date(currentDay));
}

/**
 * Trouve une plante par son id
 * @param {string} plantId
 * @returns {Promise<Plant>}
 */
export async function findPlantById(plantId) {
  const d = await db;
  const plant = await d.select("*").from("plants").where("id", plantId).first();
  return plant;
}

/**
 * @typedef {{ name: string; species: string; frequency: number; }} PlantData
 */

/**
 * Mets à jour une plante
 * @param {string} plantId
 * @param {PlantData} data
 * @returns {Promise<void>}
 */
export async function updatePlantById(plantId, data) {
  const d = await db;
  await d.update(data).from("plants").where("id", plantId);
}

/**
 * Ajoute une plante
 * @param {PlantData} data
 * @returns {Promise<void>}
 */
export async function insertPlant(data) {
  const d = await db;
  const currentDay = new Date(await today());
  await d
    .insert({
      ...data,
      id: createId(),
      createdAt: currentDay,
    })
    .into("plants");
}

/**
 * Ajoute un arrosage pour une plante
 * @param {string} plantId
 * @returns {Promise<void>}
 */
export async function plantWatering(plantId) {
  const d = await db;
  const plant = await findPlantById(plantId);
  if (!plant) {
    throw new Error("Plant not found");
  }
  const currentDay = new Date(await today());
  await d
    .insert({ id: createId(), plantId, date: currentDay })
    .into("watering");
}

/**
 * Supprime une plante
 * @param {string} plantId
 * @returns {Promise<void>}
 */
export async function removePlant(plantId) {
  const d = await db;
  const plant = await findPlantById(plantId);
  if (!plant) {
    throw new Error("Plant not found");
  }
  await d.transaction(async (trx) => {
    await trx.delete().from("plants").where("id", plantId);
    await trx.delete().from("watering").where("plantId", plantId);
  });
}

/**
 * Récupère les arrosages d'une plante
 * @param {string} plantId
 * @returns {Promise<Array<{ id: string; plantId: string; date: Date }>>}
 */
export async function findAllPlantWaterings(plantId) {
  const d = await db;
  const waterings = await d
    .select("*")
    .from("watering")
    .where("plantId", plantId)
    .orderBy("date", "desc");
  return waterings;
}
