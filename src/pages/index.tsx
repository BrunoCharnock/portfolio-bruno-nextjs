import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header>
        <nav className="animate-pulse flex items-center justify-between bg-gray-900 flex-wrap p-6">
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              <a
                href="/"
                className="block mt-4 lg:inline-block lg:mt-0 text-purple-600 hover:text-white mr-4"
              >
                Início
              </a>
              <a
                href="#responsive-header"
                className="block mt-4 lg:inline-block lg:mt-0 text-purple-600 hover:text-white mr-4"
              >
                Sobre
              </a>
              <a
                href="/contact"
                className="block mt-4 lg:inline-block lg:mt-0 text-purple-600 hover:text-white"
              >
                Contato
              </a>
            </div>
          </div>
        </nav>
      </header>
      {/* Fim Header */}

      {/* Main */}
      <main className="flex-1 mb-4 grid">
        <div className="projects-container">
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
      </main>
      {/* Fim Main */}
    </div>
  );
}
