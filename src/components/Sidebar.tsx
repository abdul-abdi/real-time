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

interface CustomView {
  id: string;
  label: string;
  active?: boolean;
}

export const Sidebar = () => {
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const [newViewName, setNewViewName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const defaultItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: true,
    },
    {
      icon: Users,
      label: "Teams",
    },
    {
      icon: PieChart,
      label: "Analytics",
    },
    {
      icon: Settings,
      label: "Settings",
    },
  ];

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

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 border-r bg-background/80 backdrop-blur-sm">
      <div className="flex h-full flex-col items-center py-4">
        <nav className="flex flex-col items-center gap-4">
          {defaultItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-10 w-10 transition-all hover:bg-muted",
                    item.active && "bg-primary text-primary-foreground"
                  )}
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