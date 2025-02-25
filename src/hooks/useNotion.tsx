
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notionClient } from "@/utils/notionClient";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export const useNotion = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const configureNotion = async (
    apiKey: string,
    projectsDatabaseId: string,
    statusDatabaseId: string,
    updatesDatabaseId: string
  ) => {
    setIsConfiguring(true);
    try {
      // Set credentials for all three databases
      notionClient.setCredentials(apiKey, projectsDatabaseId, statusDatabaseId, updatesDatabaseId);
      
      // Test the connection by fetching the databases
      await Promise.all([
        notionClient.getDatabase(projectsDatabaseId),
        notionClient.getDatabase(statusDatabaseId),
        notionClient.getDatabase(updatesDatabaseId),
      ]);

      setIsConfigured(true);
      toast({
        title: "Notion Connected",
        description: "Successfully connected to Notion databases",
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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notion-data"],
    queryFn: () => notionClient.getAllData(),
    enabled: isConfigured,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch data from Notion",
          variant: "destructive",
        });
      },
    },
  });

  return {
    projects: data?.projects || [],
    projectStatuses: data?.statuses || [],
    projectUpdates: data?.updates || [],
    isLoading,
    error,
    isConfigured,
    isConfiguring,
    configureNotion,
    refetch,
  };
};
