
import React from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { AnalyticsSection } from "@/components/sections/AnalyticsSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { CustomViewSection } from "@/components/sections/CustomViewSection";
import { CustomView } from "@/types/customView";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNotion } from "@/hooks/useNotion";
import { Loader } from "lucide-react";

const Index = () => {
  const { isConfigured, isLoading, projects, isUsingFallbackData } = useNotion();
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
  } = useProjectFilters(projects);

  const { toast } = useToast();

  const metrics = {
    totalProjects: projects.length,
    criticalIssues: projects.filter(p => p.ragStatus === "red").length,
    healthyProjects: projects.filter(p => p.ragStatus === "green").length,
    recentUpdates: projects.filter(p => {
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
    if (activeSection === "dashboard" && isConfigured) {
      toast({
        title: isUsingFallbackData ? "Dashboard Updated (Demo Data)" : "Dashboard Updated",
        description: `Showing ${filteredProjects.length} projects`,
      });
    }
  }, [filteredProjects.length, toast, activeSection, isConfigured, isUsingFallbackData]);

  const handleViewChange = (view: CustomView | null) => {
    setActiveView(view);
    if (view) {
      toast({
        title: `View: ${view.label}`,
        description: `Showing ${view.projects.length} projects`,
      });
    }
  };

  // Show loading screen while connecting to Notion or loading data
  if (!isConfigured || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-medium">Loading Dashboard...</h2>
          <p className="text-muted-foreground">
            {!isConfigured ? "Connecting to Notion" : "Loading your project data"}
          </p>
        </div>
      </div>
    );
  }

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
