export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, unknown>;
}

export interface NotionPage {
  id: string;
  properties: Record<string, unknown>;
}

export interface NotionError {
  code: string;
  message: string;
}

export interface NotionProjectUpdate {
  id: string;
  date: string;
  ragStatus: "Red" | "Amber" | "Green";
  createdBy: string;
  statusContext: string;
  projectStatusId: string;
  isCurrentWeek: boolean;
  isPrevWeek: boolean;
  isPrevPrevWeek: boolean;
  currentWeekPoints: number;
  prevWeekPoints: number;
  prevPrevWeekPoints: number;
}

export interface NotionProjectStatus {
  id: string;
  projectId: string;
  ragDangerCategory: string;
  ragDangerScore: number;
  ragContext: string;
  ragColors: string;
  statusReporters: string[];
  projectManager: string;
  techLead: string;
  group: string;
  currentWeekContext: string;
  prevWeekContext: string;
  projectDescription: string;
  projectStatus: string;
  updates: NotionProjectUpdate[];
}
