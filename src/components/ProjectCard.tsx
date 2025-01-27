import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RAGStatusIndicator } from "./project/RAGStatusIndicator";
import { ProjectMetadata } from "./project/ProjectMetadata";
import { ProjectDetailsDialog } from "./project/ProjectDetailsDialog";

interface ProjectCardProps {
  project: Project;
  view?: "grid" | "list" | "kanban";
}

export const ProjectCard = ({ project, view = "grid" }: ProjectCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all hover:shadow-lg rounded-2xl hover:scale-[1.02] duration-200",
      view === "list" && "flex items-center gap-4 p-4",
      view === "kanban" && "w-[350px] flex-shrink-0"
    )}>
      <RAGStatusIndicator status={project.ragStatus} />
      
      {view === "list" ? (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-1">{project.code}</CardDescription>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize shrink-0 transition-colors ml-4",
                  project.ragStatus === "red" && "border-rag-red text-rag-red",
                  project.ragStatus === "amber" && "border-rag-amber text-rag-amber",
                  project.ragStatus === "green" && "border-rag-green text-rag-green"
                )}
              >
                {project.ragStatus}
              </Badge>
            </div>
            <div className="mt-2">
              <ProjectMetadata project={project} view="list" />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setIsOpen(true)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-1">{project.code}</CardDescription>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize shrink-0 transition-colors",
                  project.ragStatus === "red" && "border-rag-red text-rag-red",
                  project.ragStatus === "amber" && "border-rag-amber text-rag-amber",
                  project.ragStatus === "green" && "border-rag-green text-rag-green"
                )}
              >
                {project.ragStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProjectMetadata project={project} view={view} />
              <Button
                className="w-full justify-between bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsOpen(true)}
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </>
      )}
      <ProjectDetailsDialog
        project={project}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </Card>
  );
};