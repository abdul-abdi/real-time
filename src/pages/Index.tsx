import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FilterBar } from "@/components/FilterBar";
import { ProjectCard } from "@/components/ProjectCard";
import { mockProjects } from "@/data/mockProjects";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <Sidebar />
      <main className="pl-16 pt-16 min-h-screen">
        <FilterBar />
        <div className="container py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight animate-fade-in">Project Overview</h2>
            <p className="text-muted-foreground mt-2 animate-fade-in">
              Track and manage project health status across the organization
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;