import { View, LayoutGrid, LayoutList, ChartBar, ChartPie, ChartLine, FileText, Folder, Database, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

interface CustomViewItemProps {
  view: CustomView;
  onViewClick: (view: CustomView) => void;
  onEditView: (view: CustomView) => void;
  onDeleteView: (viewId: string) => void;
}

export const CustomViewItem = ({
  view,
  onViewClick,
  onEditView,
  onDeleteView,
}: CustomViewItemProps) => {
  const IconComponent = viewIcons[view.icon as keyof typeof viewIcons];

  return (
    <div className="relative group">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={view.active ? "default" : "ghost"}
            size="icon"
            className="h-10 w-10 transition-all hover:bg-muted"
            onClick={() => onViewClick(view)}
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
          <DropdownMenuItem onClick={() => onEditView(view)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit View
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onDeleteView(view.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};