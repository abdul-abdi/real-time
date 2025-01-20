export type RAGStatus = "red" | "amber" | "green";

export type Department = "Engineering" | "Marketing" | "Sales" | "Finance" | "Operations" | "HR";

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  owners: string[];  // Changed from single owner to multiple
  departments: Department[];  // Added departments
  startDate?: string;
  endDate?: string;
  ragStatus: RAGStatus;
  dangerScore: number;
  lastUpdated: string;
  recentTrend: string;
  statusUpdate: string;
  team?: string;
  context?: string;
  group?: string;
  healthMetrics?: {
    performance: number;
    quality: number;
    schedule: number;
  };
}

export interface StatusUpdate {
  id: string;
  projectId: string;
  timestamp: string;
  ragStatus: RAGStatus;
  notes: string;
  reportedBy: string;
  context?: string;
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

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DashboardMetrics {
  totalProjects: number;
  criticalIssues: number;
  healthyProjects: number;
  statusDistribution: {
    red: number;
    amber: number;
    green: number;
  };
}

export interface ProjectFilters {
  group: string[];
  status: RAGStatus[];
  timeRange: DateRange;
  search: string;
}