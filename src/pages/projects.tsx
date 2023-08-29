import { GetServerSideProps } from "next";
import stringify from "postcss/lib/stringify";
import { useEffect, useState } from "react";
import styles from "@/styles/projects.module.css";
import { useInView } from "react-intersection-observer";

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

export async function getServerSideProps(context: any) {
  const res = await fetch("");
  const repo = await res.json();
  return { props: { repo } };
}

export default function Projects(props: any) {
  const [projects, setProjects] = useState([]);
  const { ref, inView, entry } = useInView();

  const fetchUserData = () => {
    fetch("https://api.github.com/users/BrunoCharnock/repos")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProjects(data);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <section id="projetosTab" className={styles.projectscontainer}>
        {projects.map((repo: any) => {
          return (
            <div
              ref={ref}
              key={repo.id}
              className={
                inView
                  ? styles.projectscontaineritemShown
                  : styles.projectscontaineritemHidden
              }
            >
              <div className="px-6 py-4">
                <div className={styles.projectstitle}>
                  <a title={repo.name} href={repo.html_url} target="_blank">
                    {repo.name}
                  </a>
                </div>
                <p className={styles.projectsdescription}>{repo.description}</p>
              </div>
              <div className={styles.projectstagcontainer}>
                <span className={styles.projectstag}>{repo.language}</span>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
