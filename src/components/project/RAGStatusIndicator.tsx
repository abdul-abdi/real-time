import { RAGStatus } from "@/types/project";
import { cn } from "@/lib/utils";

interface RAGStatusIndicatorProps {
  status: RAGStatus;
  className?: string;
}

export const RAGStatusIndicator = ({ status, className }: RAGStatusIndicatorProps) => {
  const ragColors = {
    red: "bg-rag-red",
    amber: "bg-rag-amber",
    green: "bg-rag-green",
  };

  return (
    <div
      className={cn(
        "absolute top-0 left-0 h-1 w-full",
        ragColors[status],
        className
      )}
    />
  );
};