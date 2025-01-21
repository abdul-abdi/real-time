import { LayoutDashboard, Users, PieChart, Settings, Plus, View, LayoutGrid, LayoutList, ChartBar, ChartPie, ChartLine, FileText, Folder, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects } from "@/data/mockProjects";
import { CustomView } from "@/types/customView";

const viewIcons = {
  view: View,
  grid: LayoutGrid,
  list: LayoutList,
  bar: ChartBar,
  pie: ChartPie,
  line: ChartLine,
  file: FileText,
  folder: Folder,
  database: Database,
};

interface SidebarProps {
  onSectionChange: (section: "dashboard" | "people" | "analytics" | "settings") => void;
  activeSection: string;
  onViewChange: (view: CustomView | null) => void;
}

export const Sidebar = ({ onSectionChange, activeSection, onViewChange }: SidebarProps) => {
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const [newViewName, setNewViewName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof viewIcons>("view");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedViews = localStorage.getItem('customViews');
    if (savedViews) {
      setCustomViews(JSON.parse(savedViews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('customViews', JSON.stringify(customViews));
  }, [customViews]);

  const defaultItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      section: "dashboard" as const,
      description: "Overview of all projects and their status",
    },
    {
      icon: Users,
      label: "People",
      section: "people" as const,
      description: "View project managers and their projects",
    },
    {
      icon: PieChart,
      label: "Analytics",
      section: "analytics" as const,
      description: "Project analytics and insights",
    },
    {
      icon: Settings,
      label: "Settings",
      section: "settings" as const,
      description: "System and user preferences",
    },
  ];

  const handleCreateView = () => {
    if (newViewName.trim() && selectedProjects.length > 0) {
      const newView = {
        id: Date.now().toString(),
        label: newViewName.trim(),
        icon: selectedIcon,
        projects: selectedProjects,
      };
      setCustomViews([...customViews, newView]);
      setNewViewName("");
      setSelectedIcon("view");
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
    onViewChange(view);
    const updatedViews = customViews.map((v) => ({
      ...v,
      active: v.id === view.id,
    }));
    setCustomViews(updatedViews);
  };

  const handleDefaultItemClick = (section: "dashboard" | "people" | "analytics" | "settings") => {
    onSectionChange(section);
    onViewChange(null);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 border-r bg-background/80 backdrop-blur-sm">
      <div className="flex h-full flex-col items-center py-4">
        <nav className="flex flex-col items-center gap-4">
          {defaultItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeSection === item.section ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-10 w-10 transition-all hover:bg-muted",
                    activeSection === item.section && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleDefaultItemClick(item.section)}
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

          {customViews.map((view) => {
            const IconComponent = viewIcons[view.icon as keyof typeof viewIcons];
            return (
              <Tooltip key={view.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={view.active ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10 transition-all hover:bg-muted"
                    onClick={() => handleCustomViewClick(view)}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{view.label} ({view.projects.length} projects)</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

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
            <DialogContent className="sm:max-w-[425px]">
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
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Select Icon</label>
                  <Select
                    value={selectedIcon}
                    onValueChange={(value: keyof typeof viewIcons) => setSelectedIcon(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(viewIcons).map(([key, Icon]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="capitalize">{key}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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