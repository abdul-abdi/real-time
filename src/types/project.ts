export type RAGStatus = "red" | "amber" | "green";

export interface Project {
  id: string;
  code: string;
  name: string;
  owner: string;
  ragStatus: RAGStatus;
  dangerScore: number;
  lastUpdated: string;
  recentTrend: string;
  statusUpdate: string;
}

export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}