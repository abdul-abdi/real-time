import { useState, useMemo } from "react";
import { mockProjects } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  UserRound, 
  ArrowUpDown,
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManagerProjectsList } from "../managers/ManagerProjectsList";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const PeopleSection = () => {
  const [sortBy, setSortBy] = useState<"name" | "projects" | "risk">("name");
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
      trend,
      performance: (healthyProjects / totalProjects) * 100
    };
  };

  const sortedManagers = useMemo(() => {
    return Object.entries(projectsByOwner).sort((a, b) => {
      const statsA = getManagerStats(a[1]);
      const statsB = getManagerStats(b[1]);

      switch (sortBy) {
        case "name":
          return a[0].localeCompare(b[0]);
        case "projects":
          return statsB.totalProjects - statsA.totalProjects;
        case "risk":
          return Number(statsB.avgDangerScore) - Number(statsA.avgDangerScore);
        default:
          return 0;
      }
    });
  }, [projectsByOwner, sortBy]);

  const toggleManager = (owner: string) => {
    setExpandedManagers(prev => 
      prev.includes(owner)
        ? prev.filter(m => m !== owner)
        : [...prev, owner]
    );
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Project Managers</h2>
          <p className="text-muted-foreground">
            Overview of project managers and their portfolio performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value: "name" | "projects" | "risk") => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="projects">Sort by Projects</SelectItem>
              <SelectItem value="risk">Sort by Risk Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
          {sortedManagers.map(([owner, projects]) => {
            const stats = getManagerStats(projects);
            const isExpanded = expandedManagers.includes(owner);
            const initials = owner
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase();
            
            return (
              <Card 
                key={owner} 
                className={cn(
                  "relative overflow-hidden group transition-all duration-200",
                  "hover:shadow-lg hover:scale-[1.02]",
                  "bg-gradient-to-br from-background to-muted"
                )}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-xl font-semibold truncate">{owner}</h3>
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
                      className="shrink-0"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <p className="text-2xl font-bold text-rag-red">{stats.criticalProjects}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Healthy</p>
                      <p className="text-2xl font-bold text-rag-green">{stats.healthyProjects}</p>
                    </div>
                    
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <p className="text-sm text-muted-foreground">Risk Score</p>
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

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Portfolio Health</span>
                      <span className="font-medium">
                        {Math.round(stats.performance)}%
                      </span>
                    </div>
                    <Progress 
                      value={stats.performance}
                      className="h-2"
                    />
                  </div>

                  {isExpanded && (
                    <ManagerProjectsList projects={projects} />
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