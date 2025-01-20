import { mockProjects } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartBar, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const PeopleSection = () => {
  const projectsByOwner = mockProjects.reduce((acc, project) => {
    project.owners.forEach(owner => {
      if (!acc[owner]) {
        acc[owner] = [];
      }
      acc[owner].push(project);
    });
    return acc;
  }, {} as Record<string, Project[]>);

  const getManagerStats = (projects: Project[]) => {
    const totalProjects = projects.length;
    const criticalProjects = projects.filter(p => p.ragStatus === 'red').length;
    const healthyProjects = projects.filter(p => p.ragStatus === 'green').length;
    const avgDangerScore = projects.reduce((acc, p) => acc + p.dangerScore, 0) / totalProjects;
    
    return {
      totalProjects,
      criticalProjects,
      healthyProjects,
      avgDangerScore: avgDangerScore.toFixed(1)
    };
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Project Managers</h2>
        <p className="text-muted-foreground mt-2">
          Detailed overview of project managers and their portfolio performance
        </p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-6">
          {Object.entries(projectsByOwner).map(([owner, projects]) => {
            const stats = getManagerStats(projects);
            
            return (
              <Card key={owner} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{owner}</h3>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          {stats.totalProjects} Projects
                        </Badge>
                        <Badge variant="outline" className="text-rag-red border-rag-red">
                          {stats.criticalProjects} Critical
                        </Badge>
                        <Badge variant="outline" className="text-rag-green border-rag-green">
                          {stats.healthyProjects} Healthy
                        </Badge>
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Risk Score</div>
                          <div className="text-2xl font-bold">{stats.avgDangerScore}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average risk score across all projects</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{project.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {project.code}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {project.departments.map((dept) => (
                              <Badge
                                key={dept}
                                variant="secondary"
                                className="text-xs"
                              >
                                {dept}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.statusUpdate}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              Risk Score
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {project.dangerScore}/10
                            </div>
                          </div>
                          <Badge
                            className={`capitalize ${
                              project.ragStatus === 'red' ? 'bg-red-100 text-red-700' :
                              project.ragStatus === 'amber' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            {project.ragStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};