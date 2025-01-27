import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, AlertTriangle, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProjectMetadataProps {
  project: Project;
}

export const ProjectMetadata = ({ project }: ProjectMetadataProps) => {
  const getStatusDuration = (lastUpdated: string) => {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffInDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getDangerLevel = (score: number) => {
    if (score >= 7) return { level: "Critical", color: "text-rag-red" };
    if (score >= 4) return { level: "Moderate", color: "text-rag-amber" };
    return { level: "Low", color: "text-rag-green" };
  };

  const dangerInfo = getDangerLevel(project.dangerScore);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Updated {getStatusDuration(project.lastUpdated)}</span>
        </div>
        <div className="flex gap-2">
          {project.departments.map((dept) => (
            <Badge
              key={dept}
              variant="outline"
              className="bg-primary/10"
            >
              {dept}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{project.owners.join(", ")}</span>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <Activity className={cn("h-4 w-4", dangerInfo.color)} />
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  project.dangerScore >= 7 && "border-rag-red text-rag-red",
                  project.dangerScore >= 4 && project.dangerScore < 7 && "border-rag-amber text-rag-amber",
                  project.dangerScore < 4 && "border-rag-green text-rag-green"
                )}
              >
                Risk Level: {project.dangerScore}/10
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{dangerInfo.level} Risk Level</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {project.dangerScore >= 7 && (
        <div className="flex items-center gap-1 text-rag-red text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Critical Risk Level</span>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <p className="line-clamp-2">{project.statusUpdate}</p>
      </div>

      {project.recentTrend && (
        <div className="text-sm">
          <span className="font-medium">Trend: </span>
          <span className="text-muted-foreground">{project.recentTrend}</span>
        </div>
      )}
    </div>
  );
};