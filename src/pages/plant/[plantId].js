import { format } from "date-fns";
import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import { ArrowLeft, Drop, FloppyDisk, Pencil, Trash } from "phosphor-react";
import { Layout } from "../../components/Layout";
import { WateringButton } from "../../components/WateringButton";
import { WateringRecap } from "../../components/WateringRecap";
import {
  computePlantNextWatering,
  findAllPlantWaterings,
  findPlantById,
} from "../../database";
import { sessionConfig } from "../../logic/session";
import fr from "date-fns/locale/fr";
import { useState, useId, Fragment } from "react";
import * as api from "../../logic/api";
import useMutation from "use-mutation";
import { useReload } from "../../hooks/useReload";
import { PlantForm } from "../../components/PlantForm";
import { useRouter } from "next/router";
import Head from "next/head";
import { frequencyText } from "../../logic/utils";

function formatFr(data, pattern) {
  return format(data, pattern, { locale: fr });
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(context) {
    if (!context.req.session.user) {
      return { redirect: { destination: "/login" } };
    }
    const { plantId } = context.params;
    const plant = await findPlantById(plantId);
    if (!plant) {
      return { notFound: true };
    }
    const waterings = await findAllPlantWaterings(plantId);
    const nextWatering = await computePlantNextWatering(plant);
    return { props: { plant, nextWatering, waterings } };
  },
  sessionConfig
);

export default function Plant({ plant, nextWatering, waterings }) {
  const reload = useReload();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const formId = useId();

  const [updatePlant, updatePlantInfos] = useMutation(api.plant, {
    onSettled: reload,
    onSuccess: () => setEditing(false),
  });

  const [deletePlant, deletePlantInfos] = useMutation(api.deletePlant, {
    onSuccess: () => {
      router.push("/");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    updatePlant({
      ...data,
      frequency: parseInt(data.frequency, 10),
    });
  }

  return (
    <Fragment>
      <Head>
        <title>{plant.name} - Plants</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-stretch gap-6">
          <div className="flex flex-row gap-4 justify-between">
            <Link href="/">
              <a className="flex flex-row items-center gap-2 hover:bg-blue-200 rounded px-4 py-1 hover:text-blue-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </a>
            </Link>
            {editing ? (
              <button
                key="save"
                className="flex flex-row items-center gap-2 rounded px-4 py-1 hover:bg-blue-200 hover:text-blue-900"
                type="submit"
                form={formId}
                disabled={updatePlantInfos.status === "running"}
              >
                <FloppyDisk className="w-5 h-5" />
                Enregistrer
              </button>
            ) : (
              <button
                key="edit"
                className="flex flex-row items-center gap-2 rounded px-4 py-1 hover:bg-blue-200 hover:text-blue-900"
                onClick={() => setEditing(true)}
                type="button"
              >
                <Pencil className="w-5 h-5" />
                Modifier
              </button>
            )}
          </div>
          {editing ? (
            <PlantForm
              id={formId}
              error={updatePlantInfos.error}
              onSubmit={handleSubmit}
              plant={plant}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <h1 className="text-center text-3xl font-extrabold text-gray-900">
                {plant.name}
              </h1>
              <p className="italic font-light text-slate-500 text-center">
                {plant.species} ({frequencyText(plant.frequency)})
              </p>
            </div>
          )}
          <div className="flex flex-row justify-between items-stretch h-10">
            <WateringRecap
              frequency={plant.frequency}
              nextWatering={nextWatering}
              align="left"
            />
            <WateringButton plantId={plant.id} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-bold uppercase text-sm tracking-wider ml-1">
              Historique
            </h2>
            {waterings.length === 0 ? (
              <div className="p-4 rounded bg-blue-100 text-center">
                <p className="text-slate-800">
                  Vous n&apos;avez pas encore arrosé cette plante
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {waterings.map((watering) => (
                  <div
                    key={watering.id}
                    className="flex flex-row items-center gap-2 rounded px-2 py-1 odd:bg-blue-200 even:bg-blue-100"
                  >
                    <Drop
                      className="w-5 h-5 mt-0.5 text-blue-600"
                      color="currentColor"
                      weight="fill"
                    />
                    <p className="text-slate-600">
                      <span className="capitalize text-slate-900">
                        {formatFr(watering.date, "iiii d LLLL y")}
                      </span>{" "}
                      {formatFr(watering.date, "'à' HH'h'mm")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (
                window.confirm("Voulez-vous vraiment supprimer cette plante ?")
              ) {
                deletePlant(plant.id);
              }
            }}
            className="text-center underline rounded-md self-center px-4 text-red-900 hover:bg-red-100 py-1 -my-1 flex flex-row items-center gap-2"
          >
            <Trash className="w-5 h-5" weight="bold" />
            Supprimer cette plante
          </button>
        </div>
      </Layout>
    </Fragment>
  );
}
