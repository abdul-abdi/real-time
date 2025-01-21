import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects } from "@/data/mockProjects";
import { CustomView } from "@/types/customView";
import { useToast } from "@/hooks/use-toast";

interface CustomViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingView: CustomView | null;
  onSave: (view: Omit<CustomView, "id">) => void;
}

export const CustomViewDialog = ({
  isOpen,
  onOpenChange,
  editingView,
  onSave,
}: CustomViewDialogProps) => {
  const [newViewName, setNewViewName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("view");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (editingView) {
      setNewViewName(editingView.label);
      setSelectedIcon(editingView.icon);
      setSelectedProjects(editingView.projects);
    } else {
      setNewViewName("");
      setSelectedIcon("view");
      setSelectedProjects([]);
    }
  }, [editingView]);

  const handleSave = () => {
    if (newViewName.trim() && selectedProjects.length > 0) {
      onSave({
        label: newViewName.trim(),
        icon: selectedIcon,
        projects: selectedProjects,
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a view name and select at least one project",
        variant: "destructive",
      });
    }
  };

  const viewIcons = {
    view: "Default View",
    grid: "Grid Layout",
    list: "List Layout",
    bar: "Bar Chart",
    pie: "Pie Chart",
    line: "Line Chart",
    file: "File View",
    folder: "Folder View",
    database: "Database View",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingView ? "Edit Custom View" : "Create Custom View"}
          </DialogTitle>
          <DialogDescription>
            {editingView
              ? "Modify your custom view settings"
              : "Create a custom view and select projects to include"}
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
              onValueChange={(value: string) => setSelectedIcon(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an icon" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(viewIcons).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <span className="capitalize">{label}</span>
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
                        setSelectedProjects(
                          selectedProjects.filter((id) => id !== project.id)
                        );
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
          <Button onClick={handleSave} className="w-full">
            {editingView ? "Update View" : "Create View"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};