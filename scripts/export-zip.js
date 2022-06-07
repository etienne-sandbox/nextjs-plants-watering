/**
 * Ce fichier permet de créer le fichier Zip à rendre
 */

main();

async function main(params) {
  const { default: archiver } = await import("archiver");
  const { default: inquirer } = await import("inquirer");
  const { createWriteStream } = await import("node:fs");
  const { resolve } = await import("node:path");

  const { nom, prenom } = await inquirer.prompt([
    {
      type: "input",
      name: "nom",
      message: "Entrez votre NOM",
    },
    {
      type: "input",
      name: "prenom",
      message: "Entrez votre Prénom",
    },
  ]);
  const prenomFormatted =
    prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
  const dest = `REACT_PLANTS_${nom
    .toUpperCase()
    .replace(/ /g, "_")}_${prenomFormatted}.zip`;

  const output = createWriteStream(resolve(dest));
  const archive = archiver("zip");

  output.on("close", function () {
    console.log(
      `Le fichier ${dest} a été créé, il ne vous reste plus qu'a l'envoyer !`
    );
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.warn(err);
      return;
    }
    throw err;
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);

  archive.file("package.json");
  archive.file("public/favicon.ico");
  archive.file(".eslintrc.json");
  archive.file("yarn.lock");
  archive.glob("*.config.js");
  archive.directory("src/", "src");
  archive.directory("data/", "data");

  archive.finalize();
}
