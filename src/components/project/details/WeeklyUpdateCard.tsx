import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{week}</h4>
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
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="font-medium">{metrics.completedTasks}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="font-medium">{metrics.pendingTasks}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="font-medium">{metrics.blockers}</div>
            <div className="text-xs text-muted-foreground">Blockers</div>
          </div>
        </div>
      </div>
    </Card>
  );
};