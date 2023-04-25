import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Rails</title>
        <meta name="description" content="A project management tool used to plan, track, and manage projects." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <p>Landing Page</p>
      </div>
    </>
  );
};

export default Home;