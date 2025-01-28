import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface WeeklyUpdateFormProps {
  onSubmit: (update: {
    update: string;
    status: "red" | "amber" | "green";
    metrics: {
      completedTasks: number;
      pendingTasks: number;
      blockers: number;
    };
  }) => void;
}

export const WeeklyUpdateForm = ({ onSubmit }: WeeklyUpdateFormProps) => {
  const [update, setUpdate] = React.useState("");
  const [status, setStatus] = React.useState<"red" | "amber" | "green">("green");
  const [metrics, setMetrics] = React.useState({
    completedTasks: 0,
    pendingTasks: 0,
    blockers: 0,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!update.trim()) {
      toast({
        title: "Error",
        description: "Please provide an update description",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ update, status, metrics });
    setUpdate("");
    setStatus("green");
    setMetrics({ completedTasks: 0, pendingTasks: 0, blockers: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Enter this week's update..."
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(value: "red" | "amber" | "green") => setStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="green">Healthy</SelectItem>
              <SelectItem value="amber">At Risk</SelectItem>
              <SelectItem value="red">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Completed Tasks</label>
          <input
            type="number"
            min="0"
            value={metrics.completedTasks}
            onChange={(e) =>
              setMetrics((prev) => ({
                ...prev,
                completedTasks: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>
        
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Pending Tasks</label>
          <input
            type="number"
            min="0"
            value={metrics.pendingTasks}
            onChange={(e) =>
              setMetrics((prev) => ({
                ...prev,
                pendingTasks: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>
        
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Blockers</label>
          <input
            type="number"
            min="0"
            value={metrics.blockers}
            onChange={(e) =>
              setMetrics((prev) => ({
                ...prev,
                blockers: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Add Update
      </Button>
    </form>
  );
};