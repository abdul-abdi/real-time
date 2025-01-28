import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProjectOverviewProps {
  project: Project;
  trendData: Array<{
    week: string;
    score: number;
    completion: number;
    risks: number;
  }>;
}

export const ProjectOverview = ({ project, trendData }: ProjectOverviewProps) => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h4 className="font-medium mb-2">Project Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div>
        <h4 className="font-medium mb-2">Risk Trend</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#888" strokeWidth={2} />
              <Line type="monotone" dataKey="completion" stroke="#4CAF50" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Latest Status</h4>
        <p className="text-sm text-muted-foreground">{project.statusUpdate}</p>
      </div>
    </div>
  );
};