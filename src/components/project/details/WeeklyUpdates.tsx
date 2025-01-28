import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WeeklyUpdateCard } from "./WeeklyUpdateCard";
import { WeeklyUpdateForm } from "./WeeklyUpdateForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface WeeklyUpdate {
  week: string;
  update: string;
  status: string;
  metrics: {
    completedTasks: number;
    pendingTasks: number;
    blockers: number;
  };
}

interface WeeklyUpdatesProps {
  updates: WeeklyUpdate[];
}

export const WeeklyUpdates = ({ updates: initialUpdates }: WeeklyUpdatesProps) => {
  const [updates, setUpdates] = useState(initialUpdates);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleAddUpdate = (newUpdate: Omit<WeeklyUpdate, "week">) => {
    const weekNumber = updates.length + 1;
    const update = {
      ...newUpdate,
      week: `Week ${weekNumber}`,
    };
    
    setUpdates([update, ...updates]);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Weekly update has been added",
    });
  };

  const getStatusDistribution = () => {
    const distribution = updates.reduce(
      (acc, update) => {
        acc[update.status as keyof typeof acc]++;
        return acc;
      },
      { red: 0, amber: 0, green: 0 }
    );
    return distribution;
  };

  const distribution = getStatusDistribution();

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Weekly Updates</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline">
          {showForm ? "Cancel" : "Add Update"}
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <WeeklyUpdateForm onSubmit={handleAddUpdate} />
        </div>
      )}

      <div className="flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rag-green" />
          <span>Healthy: {distribution.green}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rag-amber" />
          <span>At Risk: {distribution.amber}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rag-red" />
          <span>Critical: {distribution.red}</span>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {updates.map((update, index) => (
            <WeeklyUpdateCard key={index} {...update} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};