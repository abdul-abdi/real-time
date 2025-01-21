import { mockProjects } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartBar, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    const trend = avgDangerScore < 5 ? 'positive' : 'negative';
    
    return {
      totalProjects,
      criticalProjects,
      healthyProjects,
      avgDangerScore: avgDangerScore.toFixed(1),
      trend
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
              <Card key={owner} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{owner}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-primary/5">
                          {stats.totalProjects} Projects
                        </Badge>
                        <Badge variant="outline" className="text-rag-red border-rag-red bg-rag-red/5">
                          {stats.criticalProjects} Critical
                        </Badge>
                        <Badge variant="outline" className="text-rag-green border-rag-green bg-rag-green/5">
                          {stats.healthyProjects} Healthy
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-2xl font-bold">{stats.avgDangerScore}</span>
                        {stats.trend === 'positive' ? (
                          <ArrowDownRight className="h-5 w-5 text-rag-green" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-rag-red" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{project.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {project.code}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
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
                        </div>
                        <div className="flex items-center gap-4">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="w-32">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Risk Score</span>
                                  <span>{project.dangerScore}/10</span>
                                </div>
                                <Progress 
                                  value={project.dangerScore * 10} 
                                  className={cn(
                                    "h-2",
                                    project.dangerScore >= 7 ? "bg-rag-red/20" :
                                    project.dangerScore >= 4 ? "bg-rag-amber/20" :
                                    "bg-rag-green/20"
                                  )}
                                  indicatorClassName={cn(
                                    project.dangerScore >= 7 ? "bg-rag-red" :
                                    project.dangerScore >= 4 ? "bg-rag-amber" :
                                    "bg-rag-green"
                                  )}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Project risk level: {project.dangerScore}/10</p>
                            </TooltipContent>
                          </Tooltip>
                          <Badge
                            className={cn(
                              "capitalize",
                              project.ragStatus === 'red' ? 'bg-rag-red/10 text-rag-red border-rag-red' :
                              project.ragStatus === 'amber' ? 'bg-rag-amber/10 text-rag-amber border-rag-amber' :
                              'bg-rag-green/10 text-rag-green border-rag-green'
                            )}
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