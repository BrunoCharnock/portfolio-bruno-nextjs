import { GetServerSideProps } from "next";
import stringify from "postcss/lib/stringify";

interface IProject {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
}

interface IProjectProps {
  project: IProject;
}

export default function Projects(props: IProjectProps) {
  debugger;
  const projetos: IProject = Object.entries(props);
  return (
    <div>
      {projetos.map((repo: any) => {
        return (
          <div key={repo.id} className="projects-container-item">
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
  );
}
