import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const inter = Inter({ subsets: ["latin"] });

export default function Contact() {
  const { ref, inView, entry } = useInView();

  return (
    <div className="about-container">
      <div className="w-full max-w-xs">
        <h2 ref={ref} className={inView ? "show-text" : "hidden-text"}>
          Você pode usar este formulário para entrar em contato comigo
        </h2>
      </div>
    </div>
  );
}
