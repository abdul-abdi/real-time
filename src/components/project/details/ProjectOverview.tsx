import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectOverviewProps {
  project: Project;
  onAddUpdate?: () => void;
}

export const ProjectOverview = ({ project, onAddUpdate }: ProjectOverviewProps) => {
  const getCompletionPercentage = () => {
    return Math.min(Math.max((new Date().getTime() - new Date(project.startDate || "").getTime()) / 
      (new Date(project.endDate || "").getTime() - new Date(project.startDate || "").getTime()) * 100, 0), 100) || 0;
  };

  const weeklyStatuses = [
    { week: "Week 4", status: "green" },
    { week: "Week 3", status: "amber" },
    { week: "Week 2", status: "amber" },
    { week: "Week 1", status: "green" },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Overview</h3>
        <Button onClick={onAddUpdate} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Update
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-4">Project Details</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Project Managers</p>
              <p className="font-medium">{project.owners.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departments</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.departments.map((dept) => (
                  <Badge key={dept} variant="secondary">
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{project.startDate || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{project.endDate || "Not set"}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-4">Project Health</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{getCompletionPercentage().toFixed(0)}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">RAG Status History</p>
              <div className="flex gap-2">
                {weeklyStatuses.map((week, index) => (
                  <div key={index} className="flex-1">
                    <div className={cn(
                      "h-8 rounded-md mb-1",
                      week.status === "red" && "bg-rag-red/20 border-2 border-rag-red",
                      week.status === "amber" && "bg-rag-amber/20 border-2 border-rag-amber",
                      week.status === "green" && "bg-rag-green/20 border-2 border-rag-green"
                    )} />
                    <p className="text-xs text-center text-muted-foreground">{week.week}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-background rounded-lg border">
                <div className="text-xs text-muted-foreground">Quality</div>
                <div className="font-medium mt-1">{project.healthMetrics?.quality || 0}%</div>
              </div>
              <div className="text-center p-2 bg-background rounded-lg border">
                <div className="text-xs text-muted-foreground">Performance</div>
                <div className="font-medium mt-1">{project.healthMetrics?.performance || 0}%</div>
              </div>
              <div className="text-center p-2 bg-background rounded-lg border">
                <div className="text-xs text-muted-foreground">Schedule</div>
                <div className="font-medium mt-1">{project.healthMetrics?.schedule || 0}%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-medium mb-2">Latest Status</h4>
        <p className="text-sm text-muted-foreground">{project.statusUpdate}</p>
      </Card>

      {project.context && (
        <Card className="p-4">
          <h4 className="font-medium mb-2">Additional Context</h4>
          <p className="text-sm text-muted-foreground">{project.context}</p>
        </Card>
      )}
    </div>
  );
};