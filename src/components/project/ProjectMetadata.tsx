import { Project } from "@/types/project";

interface ProjectMetadataProps {
  project: Project;
}

export const ProjectMetadata = ({ project }: ProjectMetadataProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Owner</span>
        <span>{project.owner}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Danger Score</span>
        <span>{project.dangerScore}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Last Updated</span>
        <span>{project.lastUpdated}</span>
      </div>
      {project.team && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Team</span>
          <span>{project.team}</span>
        </div>
      )}
      {project.manager && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Manager</span>
          <span>{project.manager}</span>
        </div>
      )}
    </div>
  );
};