import { mockProjects } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, UserRound, Activity, TrendingUp, TrendingDown } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(projectsByOwner).map(([owner, projects]) => {
            const stats = getManagerStats(projects);
            const isExpanded = expandedManagers.includes(owner);
            
            return (
              <Card key={owner} className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <UserRound className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">{owner}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-primary/5">
                            {stats.totalProjects} Projects
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
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

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <p className="text-2xl font-bold text-rag-red">{stats.criticalProjects}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Healthy</p>
                      <p className="text-2xl font-bold text-rag-green">{stats.healthyProjects}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Danger Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{stats.avgDangerScore}</p>
                        {stats.trend === 'positive' ? (
                          <TrendingUp className="h-4 w-4 text-rag-green" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-rag-red" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-4 mt-4 animate-fade-in">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} view="list" />
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