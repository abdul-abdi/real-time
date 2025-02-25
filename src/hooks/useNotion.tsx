
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
      notionClient.setCredentials(apiKey, projectsDatabaseId, statusDatabaseId, updatesDatabaseId);
      
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
      let errorMessage = "Failed to connect to Notion";
      
      if (error instanceof Error) {
        if (error.message === "Invalid Notion API key") {
          errorMessage = "The provided Notion API key is invalid";
        } else if (error.message.includes("Invalid database ID")) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
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
        let errorMessage = "Failed to fetch data from Notion";
        
        if (error instanceof Error) {
          if (error.message === "Invalid Notion API key") {
            errorMessage = "The provided Notion API key is invalid";
          } else if (error.message.includes("Invalid database ID")) {
            errorMessage = error.message;
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
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
