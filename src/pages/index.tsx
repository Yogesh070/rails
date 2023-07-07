import Navbar from "../components/Landing/Navbar"
import HeroSection from "../components/Landing/HeroSection"
import Features from "../components/Landing/Features"
import AboutUs from "../components/Landing/AboutUs"
import Footer from "../components/Landing/Footer"
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

      <main id="Home">
        <div className="top-section">
          <Navbar />
          <HeroSection />
          <Features />
          <AboutUs />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Home;