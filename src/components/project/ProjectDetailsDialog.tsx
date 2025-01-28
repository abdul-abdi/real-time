import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface ProjectDetailsDialogProps {
  project: Project;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDetailsDialog = ({
  project,
  isOpen,
  onOpenChange,
}: ProjectDetailsDialogProps) => {
  const [selectedWeek, setSelectedWeek] = useState(0);

  // Enhanced weekly updates with more detailed information
  const weeklyUpdates = [
    { 
      week: "Week 4", 
      update: "Completed milestone 3, on track for delivery",
      status: "green",
      metrics: {
        completedTasks: 12,
        pendingTasks: 3,
        blockers: 0
      }
    },
    { 
      week: "Week 3", 
      update: "Minor delays in testing phase",
      status: "amber",
      metrics: {
        completedTasks: 8,
        pendingTasks: 7,
        blockers: 2
      }
    },
    { 
      week: "Week 2", 
      update: "Resource constraints identified",
      status: "amber",
      metrics: {
        completedTasks: 5,
        pendingTasks: 10,
        blockers: 3
      }
    },
    { 
      week: "Week 1", 
      update: "Project kickoff successful",
      status: "green",
      metrics: {
        completedTasks: 3,
        pendingTasks: 15,
        blockers: 0
      }
    },
  ];

  const currentWeekUpdate = weeklyUpdates[selectedWeek];

  // Enhanced trend data with more metrics
  const trendData = [
    { week: "Week 1", score: 3, completion: 10, risks: 1 },
    { week: "Week 2", score: 5, completion: 25, risks: 2 },
    { week: "Week 3", score: 7, completion: 45, risks: 3 },
    { week: "Week 4", score: project.dangerScore, completion: 65, risks: 2 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{project.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>{project.code}</span>
            <Badge variant="outline" className={cn(
              "capitalize",
              project.ragStatus === "red" && "border-rag-red text-rag-red",
              project.ragStatus === "amber" && "border-rag-amber text-rag-amber",
              project.ragStatus === "green" && "border-rag-green text-rag-green"
            )}>
              {project.ragStatus}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="updates">Weekly Updates</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 h-[calc(90vh-200px)]">
            <TabsContent value="overview" className="space-y-6 p-4">
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
                        <Badge key={dept} variant="secondary">{dept}</Badge>
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
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#888"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="#4CAF50"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Latest Status</h4>
                <p className="text-sm text-muted-foreground">
                  {project.statusUpdate}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="updates" className="space-y-4 p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(prev => Math.min(prev + 1, weeklyUpdates.length - 1))}
                  disabled={selectedWeek === weeklyUpdates.length - 1}
                >
                  Previous Week
                </Button>
                <span className="font-medium">{currentWeekUpdate.week}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(prev => Math.max(prev - 1, 0))}
                  disabled={selectedWeek === 0}
                >
                  Next Week
                </Button>
              </div>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{currentWeekUpdate.week}</h4>
                  <Badge variant="outline" className={cn(
                    "capitalize",
                    currentWeekUpdate.status === "red" && "border-rag-red text-rag-red",
                    currentWeekUpdate.status === "amber" && "border-rag-amber text-rag-amber",
                    currentWeekUpdate.status === "green" && "border-rag-green text-rag-green"
                  )}>
                    {currentWeekUpdate.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{currentWeekUpdate.update}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="ml-1 font-medium">{currentWeekUpdate.metrics.completedTasks}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="ml-1 font-medium">{currentWeekUpdate.metrics.pendingTasks}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blockers:</span>
                    <span className="ml-1 font-medium">{currentWeekUpdate.metrics.blockers}</span>
                  </div>
                </div>
              </Card>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Previous Updates</h4>
                <div className="space-y-4">
                  {weeklyUpdates.slice(selectedWeek + 1).map((update, index) => (
                    <Card key={index} className="p-4 opacity-60">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{update.week}</h4>
                        <Badge variant="outline" className={cn(
                          "capitalize",
                          update.status === "red" && "border-rag-red text-rag-red",
                          update.status === "amber" && "border-rag-amber text-rag-amber",
                          update.status === "green" && "border-rag-green text-rag-green"
                        )}>
                          {update.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.update}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
