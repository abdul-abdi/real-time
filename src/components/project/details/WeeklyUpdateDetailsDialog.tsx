import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface WeeklyUpdateDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  update: {
    week: string;
    update: string;
    status: string;
    metrics: {
      completedTasks: number;
      pendingTasks: number;
      blockers: number;
    };
  };
}

export const WeeklyUpdateDetailsDialog = ({
  isOpen,
  onOpenChange,
  update,
}: WeeklyUpdateDetailsDialogProps) => {
  const getStatusIcon = () => {
    switch (update.status) {
      case "red":
        return <AlertTriangle className="h-5 w-5 text-rag-red" />;
      case "amber":
        return <Clock className="h-5 w-5 text-rag-amber" />;
      case "green":
        return <CheckCircle className="h-5 w-5 text-rag-green" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {update.week} Update
            </DialogTitle>
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                update.status === "red" && "border-rag-red text-rag-red",
                update.status === "amber" && "border-rag-amber text-rag-amber",
                update.status === "green" && "border-rag-green text-rag-green"
              )}
            >
              {update.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Status Update</h4>
            <p className="text-sm">{update.update}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-green-600">
                  {update.metrics.completedTasks}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Completed Tasks</div>
              </div>
              <div className="bg-muted p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-amber-600">
                  {update.metrics.pendingTasks}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Pending Tasks</div>
              </div>
              <div className="bg-muted p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-red-600">
                  {update.metrics.blockers}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Blockers</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Progress</h4>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm">
                {update.status === "green"
                  ? "On Track"
                  : update.status === "amber"
                  ? "At Risk"
                  : "Critical"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};