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

interface CustomView {
  id: string;
  label: string;
  active?: boolean;
}

export const Sidebar = () => {
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const [newViewName, setNewViewName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: Users,
      label: "Teams",
      path: "/teams",
    },
    {
      icon: PieChart,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleItemClick = (label: string, path: string) => {
    setActiveItem(label);
    navigate(path);
    toast({
      title: "Navigation",
      description: `Navigated to ${label}`,
    });
  };

  const handleCreateView = () => {
    if (newViewName.trim()) {
      const newView = {
        id: Date.now().toString(),
        label: newViewName.trim(),
      };
      setCustomViews([...customViews, newView]);
      setNewViewName("");
      setIsDialogOpen(false);
      toast({
        title: "View Created",
        description: `New view "${newViewName}" has been created successfully.`,
      });
    }
  };

  const handleCustomViewClick = (view: CustomView) => {
    const updatedViews = customViews.map((v) => ({
      ...v,
      active: v.id === view.id,
    }));
    setCustomViews(updatedViews);
    toast({
      title: "Custom View",
      description: `Switched to ${view.label} view`,
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
                  onClick={() => handleItemClick(item.label, item.path)}
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
                <p>{view.label}</p>
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
                <DialogTitle>Create New View</DialogTitle>
                <DialogDescription>
                  Create a custom view to organize your projects
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter view name"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateView();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleCreateView}
                  className="w-full"
                  disabled={!newViewName.trim()}
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