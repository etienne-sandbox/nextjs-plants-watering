import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { resolve } from "node:path";
import { readFile } from "fs-extra";
import { Fragment } from "react";
import Head from "next/head";

const components = {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props) => <img {...props} src={props.src.replace("./public", "")} />,
  a: (props) => <a {...props} href={props.href.replace("./public", "")} />,
};

export default function Readme({ source }) {
  return (
    <Fragment>
      <Head>
        <title>Readme - Plants</title>
      </Head>
      <div className="w-full px-6 py-12">
        <div className="bg-white p-6 m-auto shadow-md rounded-md prose lg:prose-xl prose-slate">
          <MDXRemote {...source} components={components} />
        </div>
      </div>
    </Fragment>
  );
}

export async function getStaticProps() {
  const source = await readFile(resolve("README.md"));
  const mdxSource = await serialize(source);
  return { props: { source: mdxSource } };
}
