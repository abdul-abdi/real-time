import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectHeader } from "./details/ProjectHeader";
import { ProjectOverview } from "./details/ProjectOverview";
import { WeeklyUpdates } from "./details/WeeklyUpdates";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const weeklyUpdates = [
    {
      week: "Week 4",
      update: "Completed milestone 3, on track for delivery",
      status: "green",
      metrics: {
        completedTasks: 12,
        pendingTasks: 3,
        blockers: 0,
      },
    },
    {
      week: "Week 3",
      update: "Minor delays in testing phase",
      status: "amber",
      metrics: {
        completedTasks: 8,
        pendingTasks: 7,
        blockers: 2,
      },
    },
    {
      week: "Week 2",
      update: "Resource constraints identified",
      status: "amber",
      metrics: {
        completedTasks: 5,
        pendingTasks: 10,
        blockers: 3,
      },
    },
    {
      week: "Week 1",
      update: "Project kickoff successful",
      status: "green",
      metrics: {
        completedTasks: 3,
        pendingTasks: 15,
        blockers: 0,
      },
    },
  ];

  const handleAddUpdate = () => {
    setActiveTab("updates");
    setShowUpdateForm(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col">
        <ProjectHeader project={project} />
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="flex-1 overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="updates">Weekly Updates</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 h-[calc(90vh-200px)]">
            <TabsContent value="overview">
              <ProjectOverview 
                project={project} 
                onAddUpdate={handleAddUpdate}
              />
            </TabsContent>

            <TabsContent value="updates">
              <WeeklyUpdates 
                updates={weeklyUpdates}
                showForm={showUpdateForm}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};