import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { ProjectCard } from "@/components/ProjectCard";
import { mockProjects } from "@/data/mockProjects";
import { useProjectFilters } from "@/hooks/useProjectFilters";

const Index = () => {
  const {
    searchQuery,
    setSearchQuery,
    ragFilter,
    setRagFilter,
    timePeriod,
    setTimePeriod,
    sortBy,
    setSortBy,
    filteredProjects,
  } = useProjectFilters(mockProjects);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      <Sidebar />
      <main className="pl-16 pt-16 min-h-screen">
        <FilterBar
          onRagFilterChange={setRagFilter}
          onTimePeriodChange={setTimePeriod}
          onSortByChange={setSortBy}
          ragFilter={ragFilter}
          timePeriod={timePeriod}
          sortBy={sortBy}
        />
        <div className="container py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
              Project Overview
            </h2>
            <p className="text-muted-foreground mt-2 animate-fade-in">
              Track and manage project health status across the organization
            </p>
          </div>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              No projects found matching your criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;