import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CustomView } from "@/types/customView";
import { NavigationItems } from "./sidebar/NavigationItems";
import { CustomViewItem } from "./sidebar/CustomViewItem";
import { CustomViewDialog } from "./sidebar/CustomViewDialog";

interface SidebarProps {
  onSectionChange: (section: "dashboard" | "people" | "analytics" | "settings") => void;
  activeSection: string;
  onViewChange: (view: CustomView | null) => void;
}

export const Sidebar = ({ onSectionChange, activeSection, onViewChange }: SidebarProps) => {
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
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

  const handleCreateOrUpdateView = (viewData: Omit<CustomView, "id">) => {
    if (editingView) {
      const updatedViews = customViews.map(view =>
        view.id === editingView.id
          ? { ...view, ...viewData }
          : view
      );
      setCustomViews(updatedViews);
      toast({
        title: "View Updated",
        description: `Updated "${viewData.label}" with ${viewData.projects.length} projects`,
      });
    } else {
      const newView = {
        id: Date.now().toString(),
        ...viewData,
      };
      setCustomViews([...customViews, newView]);
      toast({
        title: "Custom View Created",
        description: `Created "${viewData.label}" with ${viewData.projects.length} projects`,
      });
    }
    setEditingView(null);
  };

  const handleCustomViewClick = (view: CustomView) => {
    onViewChange(view);
    const updatedViews = customViews.map((v) => ({
      ...v,
      active: v.id === view.id,
    }));
    setCustomViews(updatedViews);
  };

  const handleEditView = (view: CustomView) => {
    setEditingView(view);
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

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 border-r bg-background/80 backdrop-blur-sm">
      <div className="flex h-full flex-col items-center py-4">
        <nav className="flex flex-col items-center gap-4">
          <NavigationItems
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            onViewChange={() => onViewChange(null)}
          />

          <div className="my-2 h-px w-10 bg-border" />

          {customViews.map((view) => (
            <CustomViewItem
              key={view.id}
              view={view}
              onViewClick={handleCustomViewClick}
              onEditView={handleEditView}
              onDeleteView={handleDeleteView}
            />
          ))}

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 transition-all hover:bg-muted"
            onClick={() => {
              setEditingView(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>

          <CustomViewDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            editingView={editingView}
            onSave={handleCreateOrUpdateView}
          />
        </nav>
      </div>
    </aside>
  );
};