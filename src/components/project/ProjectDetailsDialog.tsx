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
  // Mock data for the trend chart - in a real app, this would come from the project history
  const trendData = [
    { week: "Week 1", score: 3 },
    { week: "Week 2", score: 5 },
    { week: "Week 3", score: 7 },
    { week: "Week 4", score: project.dangerScore },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.code}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h4 className="font-medium">Recent Trend</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {project.recentTrend}
              </p>
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
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Status Update</h4>
              <p className="text-sm text-muted-foreground">
                {project.statusUpdate}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="updates">
            <p className="text-sm text-muted-foreground">
              Recent updates will be displayed here.
            </p>
          </TabsContent>
          <TabsContent value="history">
            <p className="text-sm text-muted-foreground">
              Project history will be displayed here.
            </p>
          </TabsContent>
          <TabsContent value="documents">
            <p className="text-sm text-muted-foreground">
              Project documents will be displayed here.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};