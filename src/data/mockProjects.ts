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
  {
    id: "3",
    code: "C-3",
    name: "Project Gamma",
    owner: "Sarah",
    ragStatus: "red",
    dangerScore: 9,
    lastUpdated: "3 hours ago",
    recentTrend: "Critical (Red status for past 2 weeks)",
    statusUpdate: "Resource constraints causing significant delays. Escalated to management.",
  },
  {
    id: "4",
    code: "D-4",
    name: "Project Delta",
    owner: "Mike",
    ragStatus: "green",
    dangerScore: 2,
    lastUpdated: "5 days ago",
    recentTrend: "Improved (Amber to Green transition)",
    statusUpdate: "Team productivity increased after process optimization.",
  },
  {
    id: "5",
    code: "E-5",
    name: "Project Epsilon",
    owner: "Lisa",
    ragStatus: "amber",
    dangerScore: 6,
    lastUpdated: "12 hours ago",
    recentTrend: "Fluctuating between Amber and Green",
    statusUpdate: "Quality issues identified in latest release. Review in progress.",
  },
  {
    id: "6",
    code: "F-6",
    name: "Project Zeta",
    owner: "Tom",
    ragStatus: "green",
    dangerScore: 4,
    lastUpdated: "4 days ago",
    recentTrend: "Consistently Green for past month",
    statusUpdate: "All milestones achieved ahead of schedule.",
  },
  {
    id: "7",
    code: "G-7",
    name: "Project Eta",
    owner: "Rachel",
    ragStatus: "red",
    dangerScore: 8,
    lastUpdated: "1 hour ago",
    recentTrend: "Urgent intervention needed",
    statusUpdate: "Critical system failure. Emergency response team engaged.",
  },
  {
    id: "8",
    code: "H-8",
    name: "Project Theta",
    owner: "David",
    ragStatus: "amber",
    dangerScore: 5,
    lastUpdated: "8 hours ago",
    recentTrend: "Showing signs of improvement",
    statusUpdate: "New mitigation strategies implemented. Monitoring progress.",
  }
];