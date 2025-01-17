import React, { useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCardSkeleton } from "@/components/project/ProjectCardSkeleton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { mockProjects } from "@/data/mockProjects";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useInView } from "react-intersection-observer";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const { ref: loadMoreRef, inView } = useInView();

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

  const { toast } = useToast();

  const displayedProjects = filteredProjects.slice(0, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setPage((prev) => {
          const nextPage = prev + 1;
          if (nextPage * ITEMS_PER_PAGE >= filteredProjects.length) {
            setHasMore(false);
          }
          return nextPage;
        });
        setLoading(false);
      }, 500);
    }
  }, [inView, hasMore, loading, filteredProjects.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      <Sidebar onSectionChange={() => {}} activeSection="dashboard" />
      <main className="pl-16 pt-16">
        <FilterBar
          onRagFilterChange={setRagFilter}
          onTimePeriodChange={setTimePeriod}
          onSortByChange={setSortBy}
          ragFilter={ragFilter}
          timePeriod={timePeriod}
          sortBy={sortBy}
        />
        <div className="container py-8">
          <Breadcrumb
            items={[
              { label: "Projects", href: "/projects" },
              { label: "Dashboard" },
            ]}
          />
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
            <div className="bg-background/60 backdrop-blur-sm p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-2xl font-bold">{mockProjects.length}</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm p-4 rounded-lg border border-rag-red">
              <div className="text-sm text-muted-foreground">Red Status</div>
              <div className="text-2xl font-bold text-rag-red">
                {mockProjects.filter((p) => p.ragStatus === "red").length}
              </div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm p-4 rounded-lg border border-rag-amber">
              <div className="text-sm text-muted-foreground">Amber Status</div>
              <div className="text-2xl font-bold text-rag-amber">
                {mockProjects.filter((p) => p.ragStatus === "amber").length}
              </div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm p-4 rounded-lg border border-rag-green">
              <div className="text-sm text-muted-foreground">Green Status</div>
              <div className="text-2xl font-bold text-rag-green">
                {mockProjects.filter((p) => p.ragStatus === "green").length}
              </div>
            </div>
          </div>

          {displayedProjects.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {displayedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {hasMore && (
                <div ref={loadMoreRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {loading && Array.from({ length: 3 }).map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
