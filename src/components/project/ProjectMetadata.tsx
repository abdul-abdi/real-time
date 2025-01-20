import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, AlertTriangle } from "lucide-react";
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

  const getDangerBadge = (score: number) => {
    if (score >= 7) return "high";
    if (score >= 4) return "medium";
    return "low";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Updated {getStatusDuration(project.lastUpdated)}</span>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                getDangerBadge(project.dangerScore) === "high" && "border-rag-red text-rag-red",
                getDangerBadge(project.dangerScore) === "medium" && "border-rag-amber text-rag-amber",
                getDangerBadge(project.dangerScore) === "low" && "border-rag-green text-rag-green"
              )}
            >
              Risk Score: {project.dangerScore}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Project Risk Level</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{project.team || project.owner}</span>
        </div>
        {project.dangerScore >= 7 && (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-rag-red">
                <AlertTriangle className="h-4 w-4" />
                <span>High Risk</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>This project requires immediate attention</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

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