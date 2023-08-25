import Contact from "@/pages/contact";
import About from "@/pages/about";
import Navbar from "@/pages/navbar";
import LandingPage from "@/pages/landingpage";
import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps(context: any) {
  const res = await fetch("https://api.github.com/users/BrunoCharnock/repos");
  const repo = await res.json();
  return { props: { repo } };
}

export default function Home(props: any) {
  const myRef = useRef();
  useEffect(() => {
    console.log(myRef.current);
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      console.log("entrry", entry);
    });
  }, []);
  return (
    <>
      <Navbar />
      <div className="body">
        <div className="wrapper">
          <LandingPage />
          <Contact />
          <About />
        </div>
        {/*
        <div id="projetosTab" className="projects-container tabcontent">
          <Projects project={props.repo} />
        </div>

       Fim Main */}
      </div>
    </>
  );
}
