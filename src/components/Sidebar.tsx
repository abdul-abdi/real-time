import { LayoutDashboard, Users, PieChart, Settings, Plus, View, LayoutGrid, LayoutList, ChartBar, ChartPie, ChartLine, FileText, Folder, Database, Edit, Trash2, MoreVertical } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [editingView, setEditingView] = useState<CustomView | null>(null);
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

  const handleCreateOrUpdateView = () => {
    if (newViewName.trim() && selectedProjects.length > 0) {
      if (editingView) {
        // Update existing view
        const updatedViews = customViews.map(view => 
          view.id === editingView.id 
            ? {
                ...view,
                label: newViewName.trim(),
                icon: selectedIcon,
                projects: selectedProjects,
              }
            : view
        );
        setCustomViews(updatedViews);
        toast({
          title: "View Updated",
          description: `Updated "${newViewName}" with ${selectedProjects.length} projects`,
        });
      } else {
        // Create new view
        const newView = {
          id: Date.now().toString(),
          label: newViewName.trim(),
          icon: selectedIcon,
          projects: selectedProjects,
        };
        setCustomViews([...customViews, newView]);
        toast({
          title: "Custom View Created",
          description: `Created "${newViewName}" with ${selectedProjects.length} projects`,
        });
      }
      setNewViewName("");
      setSelectedIcon("view");
      setSelectedProjects([]);
      setIsDialogOpen(false);
      setEditingView(null);
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a view name and select at least one project",
        variant: "destructive",
      });
    }
  };

  const handleEditView = (view: CustomView) => {
    setEditingView(view);
    setNewViewName(view.label);
    setSelectedIcon(view.icon as keyof typeof viewIcons);
    setSelectedProjects(view.projects);
    setIsDialogOpen(true);
  };

  const handleDeleteView = (viewId: string) => {
    const updatedViews = customViews.filter(view => view.id !== viewId);
    setCustomViews(updatedViews);
    onViewChange(null);
    toast({
      title: "View Deleted",
      description: "The custom view has been removed",
    });
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
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <div className="my-2 h-px w-10 bg-border" />

          {customViews.map((view) => {
            const IconComponent = viewIcons[view.icon as keyof typeof viewIcons];
            return (
              <div key={view.id} className="relative group">
                <Tooltip>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-8 top-0 h-10 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditView(view)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteView(view.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                <DialogTitle>{editingView ? "Edit Custom View" : "Create Custom View"}</DialogTitle>
                <DialogDescription>
                  {editingView ? "Modify your custom view settings" : "Create a custom view and select projects to include"}
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
                  <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                    {mockProjects.map((project) => (
                      <div key={project.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          id={`project-${project.id}`}
                          checked={selectedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProjects([...selectedProjects, project.id]);
                            } else {
                              setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`project-${project.id}`} className="text-sm">
                          {project.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleCreateOrUpdateView}
                  className="w-full"
                  disabled={!newViewName.trim() || selectedProjects.length === 0}
                >
                  {editingView ? "Update View" : "Create View"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </aside>
  );
};
