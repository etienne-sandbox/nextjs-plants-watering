// Dans ce fichiers on définit les fonctions qui seront
// utilisées pour appeler les routes API depuis les composants

/**
 * Appel api en POST avec un body JSON
 * @param {string} path
 * @param {*} [data]
 * @returns {Promise<Response>}
 */
export async function jsonPost(path, data) {
  const response = await fetch(path, {
    method: "POST",
    headers: data
      ? {
          "Content-Type": "application/json",
        }
      : {},
    body: data ? JSON.stringify(data) : null,
  });
  if (response.ok !== true) {
    // is response is json, throw the data
    const json = await response.json();
    throw json;
  }
  return response;
}

/**
 * @param {{ username: string; password: string }}
 * @returns {Promise<void>}
 */
export async function login({ username, password }) {
  return jsonPost("/api/login", { username, password });
}

/**
 * @returns {Promise<void>}
 */
export async function logout() {
  return jsonPost("/api/logout");
}

/**
 * @param {string} plantId
 * @returns {Promise<void>}
 */
export async function plantWatering(plantId) {
  return jsonPost("/api/watering", { plantId });
}

/**
 * Create or update a plant
 * @param {{ id?: string; name: string; species: string; frequency: number; }}
 * @returns {Promise<void>}
 */
export async function plant({ id, name, species, frequency }) {
  return jsonPost("/api/plant", { id, name, species, frequency });
}

/**
 * @param {string} plantId
 * @returns {Promise<void>}
 */
export async function deletePlant(plantId) {
  return jsonPost("/api/delete-plant", { plantId });
}
