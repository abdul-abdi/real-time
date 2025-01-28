import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

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

export const WeeklyUpdateCard = ({
  week,
  update,
  status,
  metrics,
}: WeeklyUpdateCardProps) => {
  const totalTasks = metrics.completedTasks + metrics.pendingTasks;
  const completionPercentage = totalTasks > 0 
    ? (metrics.completedTasks / totalTasks) * 100 
    : 0;

  const getStatusIcon = () => {
    switch (status) {
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
    <Card className={cn(
      "p-4 hover:shadow-md transition-shadow border-l-4",
      status === "red" && "border-l-rag-red",
      status === "amber" && "border-l-rag-amber",
      status === "green" && "border-l-rag-green"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h4 className="font-medium">{week}</h4>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            status === "red" && "border-rag-red text-rag-red",
            status === "amber" && "border-rag-amber text-rag-amber",
            status === "green" && "border-rag-green text-rag-green"
          )}
        >
          {status === "red" ? "Critical" : status === "amber" ? "At Risk" : "Healthy"}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{update}</p>
      
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
              status === "red" && "bg-rag-red/20",
              status === "amber" && "bg-rag-amber/20",
              status === "green" && "bg-rag-green/20"
            )} 
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="font-medium text-green-600">{metrics.completedTasks}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="font-medium text-amber-600">{metrics.pendingTasks}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="font-medium text-red-600">{metrics.blockers}</div>
            <div className="text-xs text-muted-foreground">Blockers</div>
          </div>
        </div>
      </div>
    </Card>
  );
};