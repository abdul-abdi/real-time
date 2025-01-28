import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl font-bold">{project.name}</DialogTitle>
      <DialogDescription className="flex items-center gap-2">
        <span>{project.code}</span>
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            project.ragStatus === "red" && "border-rag-red text-rag-red",
            project.ragStatus === "amber" && "border-rag-amber text-rag-amber",
            project.ragStatus === "green" && "border-rag-green text-rag-green"
          )}
        >
          {project.ragStatus}
        </Badge>
      </DialogDescription>
    </DialogHeader>
  );
};