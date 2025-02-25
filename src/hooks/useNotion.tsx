
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notionClient } from "@/utils/notionClient";
import { Project } from "@/types/project";
import { useToast } from "@/components/ui/use-toast";

export const useNotion = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);

  const configureNotion = (apiKey: string, databaseId: string) => {
    notionClient.setCredentials(apiKey, databaseId);
    setIsConfigured(true);
    toast({
      title: "Notion Connected",
      description: "Successfully connected to Notion database",
    });
  };

  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ["notion-projects"],
    queryFn: () => notionClient.getDatabasePages(),
    enabled: isConfigured,
  });

  return {
    projects,
    isLoading,
    error,
    isConfigured,
    configureNotion,
    refetch,
  };
};
