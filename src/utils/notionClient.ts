import { 
  NotionError, 
  NotionDatabase, 
  NotionProjectUpdate, 
  NotionProjectStatus 
} from "@/types/notion";
import { Project, RAGStatus } from "@/types/project";

class NotionClient {
  private static instance: NotionClient;
  private _apiKey: string;
  private _projectsDatabaseId: string;
  private _statusDatabaseId: string;
  private _updatesDatabaseId: string;
  private readonly baseUrl = "https://api.notion.com/v1";

  private constructor() {
    this._apiKey = "";
    this._projectsDatabaseId = "";
    this._statusDatabaseId = "";
    this._updatesDatabaseId = "";
  }

  public static getInstance(): NotionClient {
    if (!NotionClient.instance) {
      NotionClient.instance = new NotionClient();
    }
    return NotionClient.instance;
  }

  public setCredentials(
    apiKey: string, 
    projectsDatabaseId: string,
    statusDatabaseId: string,
    updatesDatabaseId: string
  ) {
    console.log("Setting Notion credentials:", { 
      apiKey: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "undefined", 
      projectsDatabaseId,
      statusDatabaseId,
      updatesDatabaseId
    });
    
    this._apiKey = apiKey;
    this._projectsDatabaseId = projectsDatabaseId;
    this._statusDatabaseId = statusDatabaseId;
    this._updatesDatabaseId = updatesDatabaseId;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Making Notion API request to: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${this._apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`Notion API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData: NotionError = await response.json();
        console.error("Notion API error:", errorData);
        
        if (response.status === 401) {
          throw new Error("Invalid Notion API key");
        } else if (response.status === 404) {
          throw new Error(`Invalid database ID: ${endpoint.split('/')[2]}`);
        }
        throw new Error(`Notion API Error: ${errorData.message}`);
      }

      return response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error("Notion API request timed out");
      }
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("Failed to fetch: Network error or CORS issue");
      }
      
      throw error;
    }
  }

  public async getDatabase(databaseId: string): Promise<NotionDatabase> {
    console.log(`Getting database with ID: ${databaseId}`);
    try {
      const result = await this.fetch(`/databases/${databaseId}`);
      console.log(`Successfully retrieved database: ${databaseId}`);
      return result;
    } catch (error) {
      console.error(`Error getting database ${databaseId}:`, error);
      if (error instanceof Error) {
        if (error.message === "Invalid Notion API key") {
          throw error;
        }
        throw new Error(`Invalid database ID: ${databaseId}`);
      }
      throw error;
    }
  }

  private async queryDatabase(databaseId: string, body: object = {}): Promise<any> {
    console.log(`Querying database with ID: ${databaseId}`);
    try {
      const result = await this.fetch(`/databases/${databaseId}/query`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      console.log(`Successfully queried database: ${databaseId}`);
      return result;
    } catch (error) {
      console.error(`Error querying database ${databaseId}:`, error);
      if (error instanceof Error) {
        if (error.message === "Invalid Notion API key") {
          throw error;
        }
        throw new Error(`Invalid database ID: ${databaseId}`);
      }
      throw error;
    }
  }

  private transformProjectUpdate(page: any): NotionProjectUpdate {
    return {
      id: page.id,
      date: page.properties.Date?.date?.start || "",
      ragStatus: page.properties.RAG_Status?.select?.name || "Green",
      createdBy: page.properties.Created_by?.people[0]?.name || "",
      statusContext: page.properties.Status_Context?.rich_text[0]?.plain_text || "",
      projectStatusId: page.properties.Project_status?.relation[0]?.id || "",
      isCurrentWeek: page.properties.Is_Current_Week?.formula?.boolean || false,
      isPrevWeek: page.properties.Is_Prev_Week?.formula?.boolean || false,
      isPrevPrevWeek: page.properties.Is_PrevPrev_Week?.formula?.boolean || false,
      currentWeekPoints: page.properties.Current_Week_Points?.formula?.number || 0,
      prevWeekPoints: page.properties.Prev_Week_Points?.formula?.number || 0,
      prevPrevWeekPoints: page.properties.PrevPrev_Week_Points?.formula?.number || 0,
    };
  }

  private transformProjectStatus(page: any): NotionProjectStatus {
    return {
      id: page.id,
      projectId: page.properties.Project?.relation[0]?.id || "",
      ragDangerCategory: page.properties.RAG_Danger_Category?.formula?.string || "",
      ragDangerScore: page.properties.RAG_Danger_Score?.formula?.number || 0,
      ragContext: page.properties.RAG_Context?.formula?.string || "",
      ragColors: page.properties.RAG_Colors?.formula?.string || "",
      statusReporters: page.properties.Status_Reporters?.people?.map((p: any) => p.name) || [],
      projectManager: page.properties.Project_Manager?.rollup?.array[0]?.rich_text[0]?.plain_text || "",
      techLead: page.properties.Tech_Lead?.rollup?.array[0]?.rich_text[0]?.plain_text || "",
      group: page.properties.Group?.rollup?.array[0]?.rich_text[0]?.plain_text || "",
      currentWeekContext: page.properties.Current_Week_Context?.rollup?.array[0]?.rich_text[0]?.plain_text || "",
      prevWeekContext: page.properties.Prev_Week_Context?.rollup?.array[0]?.rich_text[0]?.plain_text || "",
      projectDescription: page.properties.Project_Description?.rich_text[0]?.plain_text || "",
      projectStatus: page.properties.Project_Status?.select?.name || "",
      updates: [],
    };
  }

  private transformProject(page: any): Project {
    return {
      id: page.id,
      code: page.properties.Project_Code?.rich_text[0]?.plain_text || "",
      name: page.properties.Project_Name?.title[0]?.plain_text || "",
      description: page.properties.Description?.rich_text[0]?.plain_text || "",
      owners: page.properties.Status_Reporters?.people?.map((p: any) => p.name) || [],
      departments: page.properties.Group?.formula?.string?.split(",") || [],
      startDate: page.properties.Start_Date?.date?.start,
      endDate: page.properties.End_Date?.date?.start,
      ragStatus: (page.properties.RAG_Status?.rollup?.array[0]?.select?.name?.toLowerCase() || "green") as RAGStatus,
      dangerScore: page.properties.RAG_Danger_Score?.rollup?.array[0]?.number || 0,
      lastUpdated: page.properties.RAG_Status_Date?.rollup?.array[0]?.date?.start || new Date().toISOString(),
      recentTrend: page.properties.RAG_Colors?.rollup?.array[0]?.formula?.string || "",
      statusUpdate: page.properties.RAG_Context?.rollup?.array[0]?.formula?.string || "",
      healthMetrics: {
        performance: page.properties.Performance_Score?.number || 0,
        quality: page.properties.Quality_Score?.number || 0,
        schedule: page.properties.Schedule_Score?.number || 0,
      },
    };
  }

  public async getAllData() {
    console.log("Getting all data from Notion");
    try {
      console.log("Checking database connections...");
      
      try {
        await this.getDatabase(this._projectsDatabaseId);
        console.log("Projects database connection successful");
      } catch (error) {
        console.error("Projects database connection failed:", error);
        throw error;
      }
      
      try {
        await this.getDatabase(this._statusDatabaseId);
        console.log("Status database connection successful");
      } catch (error) {
        console.error("Status database connection failed:", error);
        throw error;
      }
      
      try {
        await this.getDatabase(this._updatesDatabaseId);
        console.log("Updates database connection successful");
      } catch (error) {
        console.error("Updates database connection failed:", error);
        throw error;
      }

      console.log("All database connections verified, querying data...");

      const [projectsResponse, statusResponse, updatesResponse] = await Promise.all([
        this.queryDatabase(this._projectsDatabaseId),
        this.queryDatabase(this._statusDatabaseId),
        this.queryDatabase(this._updatesDatabaseId),
      ]);

      const projects = projectsResponse.results.map(this.transformProject);
      const statuses = statusResponse.results.map(this.transformProjectStatus);
      const updates = updatesResponse.results.map(this.transformProjectUpdate);

      statuses.forEach(status => {
        status.updates = updates.filter(update => update.projectStatusId === status.id);
      });

      console.log(`Data fetched successfully: ${projects.length} projects, ${statuses.length} statuses, ${updates.length} updates`);

      return {
        projects,
        statuses,
        updates,
      };
    } catch (error) {
      console.error("Error fetching Notion data:", error);
      throw error;
    }
  }
}

export const notionClient = NotionClient.getInstance();
