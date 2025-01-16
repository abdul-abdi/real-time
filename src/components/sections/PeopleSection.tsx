import { mockProjects } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PeopleSection = () => {
  // Group projects by owner
  const projectsByOwner = mockProjects.reduce((acc, project) => {
    if (!acc[project.owner]) {
      acc[project.owner] = [];
    }
    acc[project.owner].push(project);
    return acc;
  }, {} as Record<string, typeof mockProjects>);

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Project Managers</h2>
        <p className="text-muted-foreground mt-2">
          Overview of project managers and their assigned projects
        </p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-6">
          {Object.entries(projectsByOwner).map(([owner, projects]) => (
            <Card key={owner} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{owner}</h3>
                <span className="text-sm text-muted-foreground">
                  {projects.length} projects
                </span>
              </div>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.statusUpdate}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${
                      project.ragStatus === 'red' ? 'bg-red-100 text-red-700' :
                      project.ragStatus === 'amber' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {project.ragStatus.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};