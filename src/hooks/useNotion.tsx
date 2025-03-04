
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { notionClient } from "@/utils/notionClient";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export const useNotion = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Pre-define Notion credentials
  const NOTION_API_KEY = "secret_hpqJVYnkGqJG5OcPVQurhgxyFkc0QphBLlYnWQD9tu8";
  const PROJECTS_DATABASE_ID = "92c116a11c6b404daaca6dcfe7e92feb";
  const STATUS_DATABASE_ID = "d29779d059294f768e5c7c1f52d7f03d";
  const UPDATES_DATABASE_ID = "a7fb3b18296646038b5e2f524ed6c9f9";

  // Auto-configure Notion on component mount
  useEffect(() => {
    configureNotion();
  }, []);

  const configureNotion = async (
    apiKey = NOTION_API_KEY,
    projectsDatabaseId = PROJECTS_DATABASE_ID,
    statusDatabaseId = STATUS_DATABASE_ID,
    updatesDatabaseId = UPDATES_DATABASE_ID
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
