import { mockProjects } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Users, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";

export const PeopleSection = () => {
  const [expandedManagers, setExpandedManagers] = useState<string[]>([]);

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
    const criticalProjects = projects.filter(p => p.dangerScore >= 7).length;
    const healthyProjects = projects.filter(p => p.dangerScore < 4).length;
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

  const toggleManager = (owner: string) => {
    setExpandedManagers(prev => 
      prev.includes(owner)
        ? prev.filter(m => m !== owner)
        : [...prev, owner]
    );
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
            const isExpanded = expandedManagers.includes(owner);
            
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
                    <div className="flex items-center gap-4">
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <Activity className={cn(
                            "h-5 w-5",
                            Number(stats.avgDangerScore) >= 7 ? "text-rag-red" :
                            Number(stats.avgDangerScore) >= 4 ? "text-rag-amber" :
                            "text-rag-green"
                          )} />
                          <span className="text-2xl font-bold">{stats.avgDangerScore}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Avg Danger Score</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleManager(owner)}
                        className="ml-4"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-fade-in">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};