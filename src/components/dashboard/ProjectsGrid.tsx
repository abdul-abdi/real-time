import React from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectsGridProps {
  projects: Project[];
  currentView: "grid" | "list" | "kanban";
}

export const ProjectsGrid = ({ projects, currentView }: ProjectsGridProps) => {
  const renderKanbanView = () => {
    const redProjects = projects.filter(p => p.ragStatus === "red");
    const amberProjects = projects.filter(p => p.ragStatus === "amber");
    const greenProjects = projects.filter(p => p.ragStatus === "green");

    return (
      <div className="flex gap-6 overflow-x-auto pb-6">
        <div className="space-y-4 min-w-[350px]">
          <h3 className="font-semibold text-rag-red flex items-center gap-2">
            Critical Projects ({redProjects.length})
          </h3>
          <div className="space-y-4">
            {redProjects.map(project => (
              <ProjectCard key={project.id} project={project} view="kanban" />
            ))}
          </div>
        </div>
        <div className="space-y-4 min-w-[350px]">
          <h3 className="font-semibold text-rag-amber flex items-center gap-2">
            At Risk Projects ({amberProjects.length})
          </h3>
          <div className="space-y-4">
            {amberProjects.map(project => (
              <ProjectCard key={project.id} project={project} view="kanban" />
            ))}
          </div>
        </div>
        <div className="space-y-4 min-w-[350px]">
          <h3 className="font-semibold text-rag-green flex items-center gap-2">
            Healthy Projects ({greenProjects.length})
          </h3>
          <div className="space-y-4">
            {greenProjects.map(project => (
              <ProjectCard key={project.id} project={project} view="kanban" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </p>
        </div>
      </div>
    );
  }

  if (currentView === "kanban") {
    return renderKanbanView();
  }

  return (
    <div className={cn(
      "animate-fade-in",
      currentView === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      currentView === "list" && "space-y-4"
    )}>
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project}
          view={currentView}
        />
      ))}
    </div>
  );
};