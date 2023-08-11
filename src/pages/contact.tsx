import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Contact() {
  return (
    <div>
      <div className="wrapper">
        <div className="typing-demo">This is a typing demo.</div>
      </div>

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
        </div>
      </main>
      {/* Fim Main */}
    </div>
  );
}
