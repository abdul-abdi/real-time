import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectOverviewProps {
  project: Project;
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const getCompletionPercentage = () => {
    // This is a mock calculation - in a real app, you'd get this from the project data
    return Math.min(Math.max((new Date().getTime() - new Date(project.startDate || "").getTime()) / (new Date(project.endDate || "").getTime() - new Date(project.startDate || "").getTime()) * 100, 0), 100) || 0;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Project Details</h4>
          <div className="space-y-2">
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
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Project Progress</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{getCompletionPercentage().toFixed(0)}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
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