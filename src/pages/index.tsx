import HeroSection from "../components/Landing/HeroSection"
import Features from "../components/Landing/Features"
import AboutUs from "../components/Landing/AboutUs"
import Footer from "../components/Landing/Footer"
import FooterNav from "../components/Landing/FooterNav"
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
          <HeroSection />
          <Features />
          <AboutUs />
          <Footer />
          <FooterNav />
        </div>
      </main>
    </>
  );
};

export default Home;