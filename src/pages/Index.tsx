import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { ProjectCard } from "@/components/ProjectCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { mockProjects } from "@/data/mockProjects";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { AnalyticsSection } from "@/components/sections/AnalyticsSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Index = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "people" | "analytics" | "settings">("dashboard");
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

  // Define the trend data
  const trendData = [
    { name: "Jan", red: 2, amber: 3, green: 5 },
    { name: "Feb", red: 3, amber: 4, green: 3 },
    { name: "Mar", red: 1, amber: 5, green: 4 },
    { name: "Apr", red: 4, amber: 2, green: 4 },
    { name: "May", red: 2, amber: 3, green: 5 },
  ];

  useEffect(() => {
    if (activeSection === "dashboard") {
      toast({
        title: "Dashboard Updated",
        description: `Showing ${filteredProjects.length} projects`,
      });
    }
  }, [filteredProjects.length, toast, activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      <Sidebar onSectionChange={setActiveSection} activeSection={activeSection} />
      <main className="pl-16 pt-16 min-h-screen">
        {activeSection === "dashboard" && (
          <>
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
              <div className="mb-8 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
                    Project Overview
                  </h2>
                  <p className="text-muted-foreground mt-2 animate-fade-in">
                    Track and manage project health status across the organization
                  </p>
                </div>

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

                {/* Trend Chart */}
                <div className="bg-background/60 backdrop-blur-sm p-4 rounded-lg border animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">RAG Status Trend</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="red"
                          stroke="#FF4D4F"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="amber"
                          stroke="#FAAD14"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="green"
                          stroke="#52C41A"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
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
        )}
        
        {activeSection === "people" && <PeopleSection />}
        {activeSection === "analytics" && <AnalyticsSection />}
        {activeSection === "settings" && <SettingsSection />}
      </main>
    </div>
  );
};

export default Index;