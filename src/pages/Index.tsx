import React from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { mockProjects } from "@/data/mockProjects";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { AnalyticsSection } from "@/components/sections/AnalyticsSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { CustomViewSection } from "@/components/sections/CustomViewSection";
import { CustomView } from "@/types/customView";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

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
          <DashboardContent
            filteredProjects={filteredProjects}
            currentView={currentView}
            metrics={metrics}
            onRagFilterChange={setRagFilter}
            onTimePeriodChange={setTimePeriod}
            onSortByChange={setSortBy}
            onDepartmentsChange={setSelectedDepartments}
            ragFilter={ragFilter}
            timePeriod={timePeriod}
            sortBy={sortBy}
            selectedDepartments={selectedDepartments}
          />
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