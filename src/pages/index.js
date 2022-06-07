import { Layout } from "../components/Layout";
import Link from "next/link";
import Head from "next/head";
import { Fragment } from "react";

export default function Home() {
  return (
    <Fragment>
      <Layout>
        <Head>
          <title>Mes plantes - Plants</title>
        </Head>
        <div className="flex flex-col items-stretch gap-4">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Mes plantes
          </h1>
          <Link href="/readme">
            <a className="underline text-center text-xl">👉 Consignes du TP</a>
          </Link>
        </div>
      </Layout>
    </Fragment>
  );
}
