import { LayoutDashboard, PieChart, Settings, Users, Plus, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects } from "@/data/mockProjects";

interface CustomView {
  id: string;
  label: string;
  active?: boolean;
  projects: string[];
}

export const Sidebar = () => {
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const [newViewName, setNewViewName] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
      description: "Overview of all projects and their status",
    },
    {
      icon: Users,
      label: "Teams",
      path: "/teams",
      description: "View and manage team assignments",
    },
    {
      icon: PieChart,
      label: "Analytics",
      path: "/analytics",
      description: "Project analytics and insights",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      description: "System and user preferences",
    },
  ];

  const handleItemClick = (label: string, path: string, description: string) => {
    setActiveItem(label);
    navigate(path);
    toast({
      title: label,
      description: description,
    });
  };

  const handleCreateView = () => {
    if (newViewName.trim() && selectedProjects.length > 0) {
      const newView = {
        id: Date.now().toString(),
        label: newViewName.trim(),
        projects: selectedProjects,
      };
      setCustomViews([...customViews, newView]);
      setNewViewName("");
      setSelectedProjects([]);
      setIsDialogOpen(false);
      toast({
        title: "Custom View Created",
        description: `Created "${newViewName}" with ${selectedProjects.length} projects`,
      });
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a view name and select at least one project",
        variant: "destructive",
      });
    }
  };

  const handleCustomViewClick = (view: CustomView) => {
    const updatedViews = customViews.map((v) => ({
      ...v,
      active: v.id === view.id,
    }));
    setCustomViews(updatedViews);
    
    const projectNames = view.projects
      .map(id => mockProjects.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    
    toast({
      title: view.label,
      description: `Viewing ${view.projects.length} projects: ${projectNames}`,
    });
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 border-r bg-background/80 backdrop-blur-sm">
      <div className="flex h-full flex-col items-center py-4">
        <nav className="flex flex-col items-center gap-4">
          {defaultItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeItem === item.label ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-10 w-10 transition-all hover:bg-muted",
                    activeItem === item.label && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleItemClick(item.label, item.path, item.description)}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <div className="my-2 h-px w-10 bg-border" />

          {customViews.map((view) => (
            <Tooltip key={view.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={view.active ? "default" : "ghost"}
                  size="icon"
                  className="h-10 w-10 transition-all hover:bg-muted"
                  onClick={() => handleCustomViewClick(view)}
                >
                  <FolderPlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{view.label} ({view.projects.length} projects)</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 transition-all hover:bg-muted"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom View</DialogTitle>
                <DialogDescription>
                  Create a custom view and select projects to include
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter view name"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newViewName.trim()) {
                        handleCreateView();
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Select Projects</label>
                  <Select
                    value={selectedProjects.join(",")}
                    onValueChange={(value) => setSelectedProjects(value.split(",").filter(Boolean))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select projects to include" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateView}
                  className="w-full"
                  disabled={!newViewName.trim() || selectedProjects.length === 0}
                >
                  Create View
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </aside>
  );
};