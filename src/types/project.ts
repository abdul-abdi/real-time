export type RAGStatus = "red" | "amber" | "green";

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  owner: string;
  startDate?: string;
  endDate?: string;
  ragStatus: RAGStatus;
  dangerScore: number;
  lastUpdated: string;
  recentTrend: string;
  statusUpdate: string;
  team?: string;
  manager?: string;
}

export interface StatusUpdate {
  id: string;
  projectId: string;
  timestamp: string;
  ragStatus: RAGStatus;
  notes: string;
  reportedBy: string;
}

export interface ProjectStatus {
  id: string;
  projectId: string;
  reportPeriod: string;
  dangerScore: number;
  ragStatus: RAGStatus;
  statusTransition?: {
    from: RAGStatus;
    to: RAGStatus;
    timestamp: string;
  };
  team?: string;
  manager?: string;
}

export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}