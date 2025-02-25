
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notionClient } from "@/utils/notionClient";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export const useNotion = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const configureNotion = async (apiKey: string, databaseId: string) => {
    setIsConfiguring(true);
    try {
      notionClient.setCredentials(apiKey, databaseId);
      // Test the connection by fetching the database
      await notionClient.getDatabase();
      setIsConfigured(true);
      toast({
        title: "Notion Connected",
        description: "Successfully connected to Notion database",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Notion",
        variant: "destructive",
      });
      setIsConfigured(false);
    } finally {
      setIsConfiguring(false);
    }
  };

  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ["notion-projects"],
    queryFn: () => notionClient.getDatabasePages(),
    enabled: isConfigured,
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch projects",
        variant: "destructive",
      });
    },
  });

  return {
    projects,
    isLoading,
    error,
    isConfigured,
    isConfiguring,
    configureNotion,
    refetch,
  };
};
