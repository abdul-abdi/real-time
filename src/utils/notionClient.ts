
import { NotionDatabase, NotionError } from "@/types/notion";
import { Project } from "@/types/project";

class NotionClient {
  private static instance: NotionClient;
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.notion.com/v1";
  private databaseId: string;

  private constructor() {
    this.apiKey = ""; // We'll need to get this from environment variables
    this.databaseId = ""; // We'll need to get this from environment variables
  }

  public static getInstance(): NotionClient {
    if (!NotionClient.instance) {
      NotionClient.instance = new NotionClient();
    }
    return NotionClient.instance;
  }

  public setCredentials(apiKey: string, databaseId: string) {
    this.apiKey = apiKey;
    this.databaseId = databaseId;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: NotionError = await response.json();
      throw new Error(`Notion API Error: ${error.message}`);
    }

    return response.json();
  }

  public async getDatabase(): Promise<NotionDatabase> {
    return this.fetch(`/databases/${this.databaseId}`);
  }

  public async getDatabasePages(): Promise<Project[]> {
    const response = await this.fetch(`/databases/${this.databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        sorts: [
          {
            property: 'lastUpdated',
            direction: 'descending',
          },
        ],
      }),
    });

    // Transform Notion pages to Project type
    // This is a basic transformation that needs to be expanded based on your Notion database structure
    return response.results.map((page: any) => ({
      id: page.id,
      code: page.properties.code?.rich_text[0]?.plain_text || '',
      name: page.properties.name?.title[0]?.plain_text || '',
      description: page.properties.description?.rich_text[0]?.plain_text,
      owners: page.properties.owners?.multi_select?.map((owner: any) => owner.name) || [],
      departments: page.properties.departments?.multi_select?.map((dept: any) => dept.name) || [],
      startDate: page.properties.startDate?.date?.start,
      endDate: page.properties.endDate?.date?.start,
      ragStatus: page.properties.ragStatus?.select?.name?.toLowerCase() || 'green',
      dangerScore: page.properties.dangerScore?.number || 0,
      lastUpdated: page.properties.lastUpdated?.date?.start || new Date().toISOString(),
      recentTrend: page.properties.recentTrend?.select?.name || '',
      statusUpdate: page.properties.statusUpdate?.rich_text[0]?.plain_text || '',
      healthMetrics: {
        performance: page.properties.performanceMetric?.number || 0,
        quality: page.properties.qualityMetric?.number || 0,
        schedule: page.properties.scheduleMetric?.number || 0,
      },
    }));
  }
}

export const notionClient = NotionClient.getInstance();
