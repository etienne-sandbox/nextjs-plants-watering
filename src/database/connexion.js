import { resolve, dirname } from "node:path";
import Knex from "knex";
import fse from "fs-extra";
import { nanoid, customAlphabet } from "nanoid";
import { addDays, subDays } from "date-fns";

export const db = setupDatabase();

export const createId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  12
);

export async function setupDatabase() {
  const SQLITE_FILE_PATH = resolve("data", "database.sqlite");

  const knex = Knex({
    client: "better-sqlite3",
    connection: { filename: SQLITE_FILE_PATH },
    useNullAsDefault: true,
  });

  const dbAlreadyExists = fse.existsSync(SQLITE_FILE_PATH);

  await fse.ensureDir(dirname(SQLITE_FILE_PATH));

  if (!dbAlreadyExists) {
    console.log("-> Creating tables");

    await knex.schema.createTable("plants", (plantsTable) => {
      plantsTable.text("id").primary().notNullable();
      plantsTable.text("name").notNullable();
      plantsTable.text("species").notNullable();
      plantsTable.integer("frequency").notNullable();
      plantsTable.date("createdAt");
    });

    await knex.schema.createTable("watering", (wateringTable) => {
      wateringTable.text("id").primary().notNullable();
      wateringTable.text("plantId").notNullable();
      wateringTable.date("date");
    });

    let now = subDays(new Date(), 7); // today - 7

    const plants = knex("plants");
    const watering = knex("watering");

    await plants.insert({
      id: createId(),
      name: "Marc's Wife",
      species: "Orchidée",
      createdAt: now,
      frequency: 21,
    });

    const plant1Id = createId();
    await plants.insert({
      id: plant1Id,
      name: "Objection",
      species: "Avocat",
      frequency: 7,
      createdAt: now,
    });

    const plant2Id = createId();
    await plants.insert({
      id: plant2Id,
      name: "Carniflore",
      species: "Nepenthes",
      createdAt: now,
      frequency: 2,
    });

    now = addDays(now, 1); // today - 6

    now = addDays(now, 1); // today - 5
    await watering.insert({ id: createId(), plantId: plant2Id, date: now });

    now = addDays(now, 1); // today - 4
    const plant3Id = createId();
    await plants.insert({
      id: plant3Id,
      name: "Fifi",
      species: "Ficus",
      createdAt: now,
      frequency: 15,
    });

    await plants.insert({
      id: createId(),
      name: "Mojito",
      species: "Menthe",
      createdAt: now,
      frequency: 3,
    });

    now = addDays(now, 1); // today - 3
    await watering.insert({ id: createId(), plantId: plant2Id, date: now });

    now = addDays(now, 1); // today - 2
    await plants.insert({
      id: createId(),
      name: "Sauve qui pique",
      species: "Cactus",
      createdAt: now,
      frequency: 28,
    });
    await watering.insert({ id: createId(), plantId: plant2Id, date: now });

    now = addDays(now, 1); // today - 1
    await watering.insert({ id: createId(), plantId: plant2Id, date: now });
  }

  return knex;
}
