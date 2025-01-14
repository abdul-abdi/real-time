import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ragColors = {
    red: "bg-rag-red",
    amber: "bg-rag-amber",
    green: "bg-rag-green",
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
        <div
          className={cn(
            "absolute top-0 left-0 h-1 w-full",
            ragColors[project.ragStatus]
          )}
        />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>{project.code}</CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                project.ragStatus === "red" && "border-rag-red text-rag-red",
                project.ragStatus === "amber" && "border-rag-amber text-rag-amber",
                project.ragStatus === "green" && "border-rag-green text-rag-green"
              )}
            >
              {project.ragStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Owner</span>
                <span>{project.owner}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Danger Score</span>
                <span>{project.dangerScore}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{project.lastUpdated}</span>
              </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{project.name}</DialogTitle>
                  <DialogDescription>{project.code}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Recent Trend</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.recentTrend}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Status Update</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.statusUpdate}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};