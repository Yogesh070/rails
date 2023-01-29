import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from Rails" });

  return (
    <>
      <Head>
        <title>Rails</title>
        <meta name="description" content="A project management tool used to plan, track, and manage projects." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>{hello.data?.greeting}</h1>
    </>
  );
};

export default Home;