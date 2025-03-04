
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { notionClient } from "@/utils/notionClient";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { mockProjects } from "@/data/mockProjects";

export const useNotion = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [useFallbackData, setUseFallbackData] = useState(false);

  // Pre-define Notion credentials
  const NOTION_API_KEY = "secret_hpqJVYnkGqJG5OcPVQurhgxyFkc0QphBLlYnWQD9tu8";
  const PROJECTS_DATABASE_ID = "92c116a11c6b404daaca6dcfe7e92feb";
  const STATUS_DATABASE_ID = "d29779d059294f768e5c7c1f52d7f03d";
  const UPDATES_DATABASE_ID = "a7fb3b18296646038b5e2f524ed6c9f9";

  // Log credentials (safely) on initialization
  useEffect(() => {
    console.log("Notion Hook Initialized with credentials:", {
      apiKey: NOTION_API_KEY ? `${NOTION_API_KEY.substring(0, 4)}...${NOTION_API_KEY.substring(NOTION_API_KEY.length - 4)}` : "undefined",
      projectsDbId: PROJECTS_DATABASE_ID,
      statusDbId: STATUS_DATABASE_ID,
      updatesDbId: UPDATES_DATABASE_ID
    });
  }, []);

  // Auto-configure Notion on component mount
  useEffect(() => {
    console.log("Attempting to auto-configure Notion client");
    configureNotion();
  }, []);

  const configureNotion = async (
    apiKey = NOTION_API_KEY,
    projectsDatabaseId = PROJECTS_DATABASE_ID,
    statusDatabaseId = STATUS_DATABASE_ID,
    updatesDatabaseId = UPDATES_DATABASE_ID
  ) => {
    console.log("Starting Notion configuration");
    setIsConfiguring(true);
    
    try {
      console.log("Setting Notion client credentials");
      notionClient.setCredentials(apiKey, projectsDatabaseId, statusDatabaseId, updatesDatabaseId);
      
      console.log("Testing connections to databases");
      await Promise.all([
        notionClient.getDatabase(projectsDatabaseId),
        notionClient.getDatabase(statusDatabaseId),
        notionClient.getDatabase(updatesDatabaseId),
      ]);

      console.log("All database connections successful, configuration complete");
      setIsConfigured(true);
      setUseFallbackData(false);
      toast({
        title: "Notion Connected",
        description: "Successfully connected to Notion databases",
      });
    } catch (error) {
      let errorMessage = "Failed to connect to Notion";
      console.error("Notion configuration error:", error);
      
      if (error instanceof Error) {
        if (error.message === "Invalid Notion API key") {
          errorMessage = "The provided Notion API key is invalid";
          console.error("Invalid API key error");
        } else if (error.message.includes("Invalid database ID")) {
          errorMessage = error.message;
          console.error("Invalid database ID error:", error.message);
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error: Could not reach Notion API";
          console.error("Network error - Failed to fetch");
        } else {
          console.error("Other Notion error:", error.message);
        }
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Activate fallback mode and set configured to allow the app to proceed
      console.log("Activating fallback data mode due to Notion connection failure");
      setUseFallbackData(true);
      setIsConfigured(true);
      
      toast({
        title: "Using Demo Data",
        description: "Continuing with demo data since Notion connection failed",
      });
    } finally {
      console.log("Configuration attempt completed, setting isConfiguring to false");
      setIsConfiguring(false);
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notion-data"],
    queryFn: async () => {
      console.log("Executing query function to fetch notion data");
      
      if (useFallbackData) {
        console.log("Using fallback mock data instead of real Notion data");
        
        // Create a simulated delay to mimic a network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
          projects: mockProjects,
          statuses: [],
          updates: [],
        };
      }
      
      return notionClient.getAllData();
    },
    enabled: isConfigured,
    meta: {
      onError: (error: Error) => {
        let errorMessage = "Failed to fetch data from Notion";
        console.error("Query error:", error);
        
        if (error instanceof Error) {
          if (error.message === "Invalid Notion API key") {
            errorMessage = "The provided Notion API key is invalid";
          } else if (error.message.includes("Invalid database ID")) {
            errorMessage = error.message;
          } else if (error.message.includes("Failed to fetch")) {
            errorMessage = "Network error: Could not reach Notion API";
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        // If we encounter an error during data fetching, switch to fallback data
        if (!useFallbackData) {
          console.log("Switching to fallback data after query error");
          setUseFallbackData(true);
          refetch();
        }
      },
    },
  });

  console.log("useNotion hook state:", {
    isConfigured,
    isConfiguring,
    isLoading,
    useFallbackData,
    hasData: !!data,
    errorPresent: !!error
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
    isUsingFallbackData: useFallbackData
  };
};
