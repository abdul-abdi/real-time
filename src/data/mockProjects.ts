import { Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "1",
    code: "A-1",
    name: "Project Alpha",
    owner: "Jade",
    ragStatus: "green",
    dangerScore: 3,
    lastUpdated: "2 days ago",
    recentTrend: "Steady (last 3 weeks were all Green)",
    statusUpdate: "No major issues. All tasks on schedule.",
  },
  {
    id: "2",
    code: "B-2",
    name: "Project Beta",
    owner: "Alex",
    ragStatus: "amber",
    dangerScore: 7,
    lastUpdated: "1 day ago",
    recentTrend: "Declining (dropped from Green to Amber last week)",
    statusUpdate: "Possible supplier delays, investigating impact.",
  },
];