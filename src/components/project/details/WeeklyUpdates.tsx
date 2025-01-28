import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WeeklyUpdateCard } from "./WeeklyUpdateCard";
import { Card } from "@/components/ui/card";

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

export const WeeklyUpdates = ({ updates }: WeeklyUpdatesProps) => {
  const [selectedWeek, setSelectedWeek] = useState(0);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedWeek((prev) => Math.min(prev + 1, updates.length - 1))}
          disabled={selectedWeek === updates.length - 1}
        >
          Previous Week
        </Button>
        <span className="font-medium">{updates[selectedWeek].week}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedWeek((prev) => Math.max(prev - 1, 0))}
          disabled={selectedWeek === 0}
        >
          Next Week
        </Button>
      </div>

      <WeeklyUpdateCard {...updates[selectedWeek]} isActive />

      <div className="mt-6">
        <h4 className="font-medium mb-4">Previous Updates</h4>
        <div className="space-y-4">
          {updates.slice(selectedWeek + 1).map((update, index) => (
            <WeeklyUpdateCard key={index} {...update} />
          ))}
        </div>
      </div>
    </div>
  );
};