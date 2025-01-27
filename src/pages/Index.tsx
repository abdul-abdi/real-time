import React from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { ProjectCard } from "@/components/ProjectCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { mockProjects } from "@/data/mockProjects";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { AnalyticsSection } from "@/components/sections/AnalyticsSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { CustomViewSection } from "@/components/sections/CustomViewSection";
import { CustomView } from "@/types/customView";

const Index = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "people" | "analytics" | "settings">("dashboard");
  const [activeView, setActiveView] = useState<CustomView | null>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list" | "kanban">(() => {
    const savedSettings = localStorage.getItem('displaySettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return settings.defaultView || "grid";
    }
    return "grid";
  });

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
  } = useProjectFilters(mockProjects);

  const { toast } = useToast();

  const metrics = {
    totalProjects: mockProjects.length,
    criticalIssues: mockProjects.filter(p => p.ragStatus === "red").length,
    healthyProjects: mockProjects.filter(p => p.ragStatus === "green").length,
    recentUpdates: mockProjects.filter(p => {
      const lastUpdated = new Date(p.lastUpdated);
      const now = new Date();
      return now.getTime() - lastUpdated.getTime() < 24 * 60 * 60 * 1000;
    }).length,
  };

  useEffect(() => {
    const handleViewChange = (event: CustomEvent) => {
      setCurrentView(event.detail.view);
    };

    window.addEventListener('viewSettingsChanged', handleViewChange as EventListener);
    return () => {
      window.removeEventListener('viewSettingsChanged', handleViewChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (activeSection === "dashboard") {
      toast({
        title: "Dashboard Updated",
        description: `Showing ${filteredProjects.length} projects`,
      });
    }
  }, [filteredProjects.length, toast, activeSection]);

  const handleViewChange = (view: CustomView | null) => {
    setActiveView(view);
    if (view) {
      toast({
        title: `View: ${view.label}`,
        description: `Showing ${view.projects.length} projects`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      <Sidebar 
        onSectionChange={setActiveSection} 
        activeSection={activeSection}
        onViewChange={handleViewChange}
      />
      <main className="pl-16 pt-16 min-h-screen">
        {activeSection === "dashboard" && !activeView && (
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
                  { label: "Projects", href: "/projects" },
                  { label: "Dashboard" },
                ]}
              />
              
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in">
                  Project Overview
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
                <div className={cn(
                  "animate-fade-in",
                  currentView === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                  currentView === "list" && "space-y-4",
                  currentView === "kanban" && "flex gap-6 overflow-x-auto pb-6"
                )}>
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      view={currentView}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {activeView && <CustomViewSection view={activeView} />}
        {activeSection === "people" && <PeopleSection />}
        {activeSection === "analytics" && <AnalyticsSection />}
        {activeSection === "settings" && <SettingsSection />}
      </main>
    </div>
  );
};

export default Index;
