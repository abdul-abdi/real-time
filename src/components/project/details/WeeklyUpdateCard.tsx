import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WeeklyUpdateCardProps {
  week: string;
  update: string;
  status: string;
  metrics: {
    completedTasks: number;
    pendingTasks: number;
    blockers: number;
  };
  isActive?: boolean;
}

export const WeeklyUpdateCard = ({
  week,
  update,
  status,
  metrics,
  isActive = false,
}: WeeklyUpdateCardProps) => {
  return (
    <Card className={cn(
      "p-4 transition-all duration-200",
      !isActive && "opacity-60 hover:opacity-80"
    )}>
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
          {status}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{update}</p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Completed:</span>
          <span className="ml-1 font-medium">{metrics.completedTasks}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Pending:</span>
          <span className="ml-1 font-medium">{metrics.pendingTasks}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Blockers:</span>
          <span className="ml-1 font-medium">{metrics.blockers}</span>
        </div>
      </div>
    </Card>
  );
};