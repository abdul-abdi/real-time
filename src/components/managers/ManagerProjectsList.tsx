import { Project } from "@/types/project";
import { ProjectCard } from "../ProjectCard";

interface ManagerProjectsListProps {
  projects: Project[];
}

export const ManagerProjectsList = ({ projects }: ManagerProjectsListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-6 animate-fade-in">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} view="list" />
      ))}
    </div>
  );
};