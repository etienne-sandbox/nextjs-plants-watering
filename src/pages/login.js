import useMutation from "use-mutation";
import { Layout } from "../components/Layout";
import { ErrorBox } from "../components/ErrorBox";
import * as api from "../logic/api";
import { withIronSessionSsr } from "iron-session/next";
import { sessionConfig } from "../logic/session";
import { useReload } from "../hooks/useReload";
import { Fragment } from "react";
import Head from "next/head";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(context) {
    if (context.req.session.user) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }
    return { props: {} };
  },
  sessionConfig
);

export default function Login({ projectsCount, ideasCount }) {
  const reload = useReload();

  const [login, loginInfos] = useMutation(api.login, {
    onSettled: reload,
  });

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    login(data);
  }

  return (
    <Fragment>
      <Head>
        <title>Connexion - Plants</title>
      </Head>
      <Layout timeTravel={false}>
        <div className="gap-4 flex flex-col items-stretch">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Connexion
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {loginInfos.error && <ErrorBox error={loginInfos.error} />}
            <div className="rounded-md shadow-sm">
              <input
                type="text"
                name="username"
                className="appearance-none relative block w-full px-3 py-2 border rounded-md sm:text-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Nom d'utilisateur"
                required
              />
            </div>
            <div className="rounded-md shadow-sm">
              <input
                type="password"
                name="password"
                className="appearance-none relative block w-full px-3 py-2 border rounded-md sm:text-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Mot de passe"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-blue-400 text-sm font-medium text-slate-900 rounded-md bg-blue-200 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-200"
              disabled={loginInfos.status === "running"}
            >
              Connexion
            </button>
          </form>
        </div>
      </Layout>
    </Fragment>
  );
}
