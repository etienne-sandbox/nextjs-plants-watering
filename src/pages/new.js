import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { Layout } from "../components/Layout";
import { PlantForm } from "../components/PlantForm";
import { useId, Fragment } from "react";
import { useRouter } from "next/router";
import useMutation from "use-mutation";
import * as api from "../logic/api";
import Head from "next/head";

export default function NewPlant() {
  const formId = useId();
  const router = useRouter();

  const [createPlant, createPlantInfos] = useMutation(api.plant, {
    onSuccess: () => {
      router.push("/");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    createPlant({
      ...data,
      frequency: parseInt(data.frequency, 10),
    });
  }

  return (
    <Fragment>
      <Head>
        <title>Nouvelle plante - Plants</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-stretch gap-4">
          <div className="flex flex-row gap-4 justify-between">
            <Link href="/">
              <a className="flex flex-row items-center gap-2 hover:bg-blue-200 rounded px-4 py-1 hover:text-blue-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </a>
            </Link>
          </div>
          <PlantForm
            id={formId}
            error={createPlantInfos.error}
            onSubmit={handleSubmit}
          />
          <button
            type="submit"
            form={formId}
            className="w-full flex justify-center py-2 px-4 border border-blue-400 text-sm font-medium text-slate-900 rounded-md bg-blue-200 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-200"
          >
            Ajouter
          </button>
        </div>
      </Layout>
    </Fragment>
  );
}
