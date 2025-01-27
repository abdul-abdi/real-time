import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, AlertTriangle, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProjectMetadataProps {
  project: Project;
  view?: "grid" | "list" | "kanban";
}

export const ProjectMetadata = ({ project, view = "grid" }: ProjectMetadataProps) => {
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

  const getTrendIcon = (trend: string) => {
    const isPositive = trend.toLowerCase().includes('positive') || 
                      trend.toLowerCase().includes('improving') ||
                      trend.toLowerCase().includes('better');
    return isPositive ? 
      <TrendingUp className="h-4 w-4 text-rag-green" /> : 
      <TrendingDown className="h-4 w-4 text-rag-red" />;
  };

  const dangerInfo = getDangerLevel(project.dangerScore);

  const renderTrendHistory = () => {
    // This would ideally come from the API, but for now we'll simulate it
    const trendColors = ['red', 'amber', 'green', 'amber']; // Last 4 weeks
    return (
      <div className="flex gap-1">
        {trendColors.map((color, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              color === 'red' && "bg-rag-red",
              color === 'amber' && "bg-rag-amber",
              color === 'green' && "bg-rag-green"
            )}
          />
        ))}
      </div>
    );
  };

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{getStatusDuration(project.lastUpdated)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="line-clamp-1">{project.owners.join(", ")}</span>
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
                Danger Score: {project.dangerScore}/10
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{dangerInfo.level} Danger Level</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

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
          <span className="line-clamp-1">{project.owners.join(", ")}</span>
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
                Danger Score: {project.dangerScore}/10
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{dangerInfo.level} Danger Level</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {project.dangerScore >= 7 && (
        <div className="flex items-center gap-1 text-rag-red text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Critical Danger Level</span>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground line-clamp-2">
          {project.statusUpdate}
        </div>
      </div>

      {project.recentTrend && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getTrendIcon(project.recentTrend)}
            <span className="text-muted-foreground">{project.recentTrend}</span>
          </div>
          <Tooltip>
            <TooltipTrigger>
              {renderTrendHistory()}
            </TooltipTrigger>
            <TooltipContent>
              <p>RAG Status History (Last 4 Weeks)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};