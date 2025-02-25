
import React from "react";
import { FilterBar } from "@/components/FilterBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";
import { NotionConfig } from "@/components/notion/NotionConfig";
import { Project } from "@/types/project";
import { useNotion } from "@/hooks/useNotion";
import { Loader } from "lucide-react";

interface DashboardContentProps {
  filteredProjects: Project[];
  currentView: "grid" | "list" | "kanban";
  metrics: {
    totalProjects: number;
    criticalIssues: number;
    healthyProjects: number;
    recentUpdates: number;
  };
  onRagFilterChange: (value: string) => void;
  onTimePeriodChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onDepartmentsChange: (departments: string[]) => void;
  ragFilter: string;
  timePeriod: string;
  sortBy: string;
  selectedDepartments: string[];
}

export const DashboardContent = ({
  filteredProjects,
  currentView,
  metrics,
  onRagFilterChange,
  onTimePeriodChange,
  onSortByChange,
  onDepartmentsChange,
  ragFilter,
  timePeriod,
  sortBy,
  selectedDepartments,
}: DashboardContentProps) => {
  const { isConfigured, isLoading } = useNotion();

  return (
    <>
      <FilterBar
        onRagFilterChange={onRagFilterChange}
        onTimePeriodChange={onTimePeriodChange}
        onSortByChange={onSortByChange}
        onDepartmentsChange={onDepartmentsChange}
        ragFilter={ragFilter}
        timePeriod={timePeriod}
        sortBy={sortBy}
        selectedDepartments={selectedDepartments}
      />
      <div className="container py-8">
        <Breadcrumb
          items={[
            { label: "Projects", href: "/projects" },
            { label: "Dashboard" },
          ]}
        />
        
        {!isConfigured && <NotionConfig />}

        {isConfigured && isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading projects from Notion...</p>
          </div>
        )}

        {isConfigured && !isLoading && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in">
                Project Overview
              </h2>
              
              <StatsOverview {...metrics} />
            </div>

            <ProjectsGrid
              projects={filteredProjects}
              currentView={currentView}
            />
          </>
        )}
      </div>
    </>
  );
};
