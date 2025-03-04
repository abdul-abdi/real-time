
import React from "react";
import { FilterBar } from "@/components/FilterBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";
import { NotionConfig } from "@/components/notion/NotionConfig";
import { Project } from "@/types/project";
import { useNotion } from "@/hooks/useNotion";
import { Loader, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { isConfigured, isLoading, isUsingFallbackData, validationErrors } = useNotion();

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
            <p className="text-lg text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {isConfigured && !isLoading && (
          <>
            {isUsingFallbackData && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Could not connect to Notion API. Showing demo data instead. 
                  {validationErrors && validationErrors.length > 0 && (
                    <div className="mt-2">
                      <strong>Connection errors:</strong>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button 
                    className="text-primary hover:underline ml-2"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in">
                Project Overview {isUsingFallbackData && "(Demo Data)"}
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
