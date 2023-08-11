import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
          {/* Item 1 */}
          <div className="projects-container-item">
            <div className="px-6 py-4">
              <div className="projects-title">Clone-tabnews</div>
              <p className="projects-description">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="projects-tag">#JavaScript</span>
              <span className="projects-tag">#Html</span>
              <span className="projects-tag">#Css</span>
            </div>
          </div>
          {/* Item 1 */}
          <div className="projects-container-item">
            <div className="px-6 py-4">
              <div className="projects-title">Clone-tabnews</div>
              <p className="projects-description">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="projects-tag">#JavaScript</span>
              <span className="projects-tag">#Html</span>
              <span className="projects-tag">#Css</span>
            </div>
          </div>
          {/* Item 1 */}
          <div className="projects-container-item">
            <div className="px-6 py-4">
              <div className="projects-title">Clone-tabnews</div>
              <p className="projects-description">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="projects-tag">#JavaScript</span>
              <span className="projects-tag">#Html</span>
              <span className="projects-tag">#Css</span>
            </div>
          </div>
          {/* Item 1 */}
          <div className="projects-container-item">
            <div className="px-6 py-4">
              <div className="projects-title">Clone-tabnews</div>
              <p className="projects-description">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="projects-tag">#JavaScript</span>
              <span className="projects-tag">#Html</span>
              <span className="projects-tag">#Css</span>
            </div>
          </div>
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
