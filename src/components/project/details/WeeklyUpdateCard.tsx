import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeeklyUpdateDetailsDialog } from "./WeeklyUpdateDetailsDialog";

interface WeeklyUpdateCardProps {
  week: string;
  update: string;
  status: string;
  metrics: {
    completedTasks: number;
    pendingTasks: number;
    blockers: number;
  };
}

export const WeeklyUpdateCard = (props: WeeklyUpdateCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const totalTasks = props.metrics.completedTasks + props.metrics.pendingTasks;
  const completionPercentage = totalTasks > 0 
    ? (props.metrics.completedTasks / totalTasks) * 100 
    : 0;

  const getStatusIcon = () => {
    switch (props.status) {
      case "red":
        return <AlertTriangle className="h-4 w-4 text-rag-red" />;
      case "amber":
        return <Clock className="h-4 w-4 text-rag-amber" />;
      case "green":
        return <CheckCircle className="h-4 w-4 text-rag-green" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4",
          props.status === "red" && "border-l-rag-red",
          props.status === "amber" && "border-l-rag-amber",
          props.status === "green" && "border-l-rag-green"
        )}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h4 className="font-medium">{props.week}</h4>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "capitalize",
              props.status === "red" && "border-rag-red text-rag-red",
              props.status === "amber" && "border-rag-amber text-rag-amber",
              props.status === "green" && "border-rag-green text-rag-green"
            )}
          >
            {props.status === "red" ? "Critical" : props.status === "amber" ? "At Risk" : "Healthy"}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{props.update}</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress 
              value={completionPercentage} 
              className={cn(
                "h-2",
                props.status === "red" && "bg-rag-red/20",
                props.status === "amber" && "bg-rag-amber/20",
                props.status === "green" && "bg-rag-green/20"
              )} 
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-medium text-green-600">{props.metrics.completedTasks}</div>
              <div className="text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-medium text-amber-600">{props.metrics.pendingTasks}</div>
              <div className="text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-medium text-red-600">{props.metrics.blockers}</div>
              <div className="text-muted-foreground">Blockers</div>
            </div>
          </div>
        </div>
      </Card>

      <WeeklyUpdateDetailsDialog
        isOpen={showDetails}
        onOpenChange={setShowDetails}
        update={props}
      />
    </>
  );
};