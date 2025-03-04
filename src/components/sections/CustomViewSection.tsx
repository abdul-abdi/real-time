
import { FilterBar } from "@/components/FilterBar";
import { ProjectCard } from "@/components/ProjectCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { CustomView } from "@/types/customView";
import { useNotion } from "@/hooks/useNotion";

interface CustomViewSectionProps {
  view: CustomView;
}

export const CustomViewSection = ({ view }: CustomViewSectionProps) => {
  const { projects: allProjects } = useNotion();
  const viewProjects = allProjects.filter(p => view.projects.includes(p.id));
  
  const {
    searchQuery,
    setSearchQuery,
    ragFilter,
    setRagFilter,
    timePeriod,
    setTimePeriod,
    sortBy,
    setSortBy,
    selectedDepartments,
    setSelectedDepartments,
    filteredProjects,
  } = useProjectFilters(viewProjects);

  const metrics = {
    totalProjects: viewProjects.length,
    criticalIssues: viewProjects.filter(p => p.ragStatus === "red").length,
    healthyProjects: viewProjects.filter(p => p.ragStatus === "green").length,
    recentUpdates: viewProjects.filter(p => {
      const lastUpdated = new Date(p.lastUpdated);
      const now = new Date();
      return now.getTime() - lastUpdated.getTime() < 24 * 60 * 60 * 1000;
    }).length,
  };

  return (
    <>
      <FilterBar
        onRagFilterChange={setRagFilter}
        onTimePeriodChange={setTimePeriod}
        onSortByChange={setSortBy}
        onDepartmentsChange={setSelectedDepartments}
        ragFilter={ragFilter}
        timePeriod={timePeriod}
        sortBy={sortBy}
        selectedDepartments={selectedDepartments}
      />
      <div className="container py-8">
        <Breadcrumb
          items={[
            { label: "Views", href: "/views" },
            { label: view.label },
          ]}
        />
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in">
            {view.label} Overview
          </h2>
          
          <StatsOverview {...metrics} />
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-lg font-semibold">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria to find what you're
                looking for.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
