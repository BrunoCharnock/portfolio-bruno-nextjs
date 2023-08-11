import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps(context: any) {
  const projetos = await fetch(
    "https://api.github.com/users/BrunoCharnock/repos"
  ).then((response) => {
    return response.json();
  });

  return {
    props: {
      repos: projetos,
      teste: 2,
    },
  };
}

export default function Home(props: any) {
  console.log(props.repos);
  function SetTabOn(id: string) {
    // Declare all variables
    var i, tablinks;
    console.log(id);
    // Get all elements with class="tabcontent" and hide them
    var tabcontent = Array.from(
      document.getElementsByClassName(
        "tabcontent"
      ) as HTMLCollectionOf<HTMLElement>
    );
    console.log(tabcontent.length);
    tabcontent.forEach((tab) => {
      var tablink = document.getElementById(tab.id + "link") as HTMLElement;
      if (tab.id === id) {
        tab.style.display = "grid";
        tablink.className = "tablinks active";
      } else {
        tab.style.display = "none";
        tablink.className = "tablinks";
      }
    });
  }

  return (
    <>
      <div className="wrapper">
        <div className="typing-demo">
          Olá, me chamo Bruno e sou Desenvolvedor.
        </div>
        <div className="tab">
          <button
            id="projetosTablink"
            className="tablinks"
            onClick={() => SetTabOn("projetosTab")}
          >
            Projetos
          </button>
          <button
            id="sobreTablink"
            className="tablinks"
            onClick={() => SetTabOn("sobreTab")}
          >
            Sobre
          </button>
          <button
            id="contatoTablink"
            className="tablinks"
            onClick={() => SetTabOn("contatoTab")}
          >
            Contato
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 mb-4 grid">
        <div id="projetosTab" className="projects-container tabcontent">
          {/* Itera sobre os repositórios públicos no perfil do GitHub */}
          {props.repos.map((repo: any) => {
            return (
              <div className="projects-container-item">
                <div className="px-6 py-4">
                  <div className="projects-title">
                    <a title={repo.name} href={repo.html_url} target="_blank">
                      {repo.name}
                    </a>
                  </div>
                  <p className="projects-description">{repo.description}</p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="projects-tag">{repo.language}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div id="sobreTab" className="sobre-container tabcontent">
          <div>
            <h2 className="text-black text-center">SOBRE MIM</h2>
          </div>
        </div>

        <div id="contatoTab" className="contato-container tabcontent">
          <div>
            <h2 className="text-black text-center">CONTATO</h2>
          </div>
        </div>
      </main>
      {/* Fim Main */}
    </>
  );
}
