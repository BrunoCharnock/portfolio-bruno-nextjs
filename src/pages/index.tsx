import Contact from "@/pages/contact";
import About from "@/pages/about";
import Navbar from "@/pages/navbar";
import LandingPage from "@/pages/landingpage";
import Footer from "@/pages/footer";
import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import Projects from "./projects";
const inter = Inter({ subsets: ["latin"] });

export default function Home(props: any) {
  return (
    <>
      <Navbar />
      <div className="body">
        <div className="wrapper">
          <LandingPage />
          <About />
          <Projects />
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  );
}
