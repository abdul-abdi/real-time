import { LayoutDashboard, Users, PieChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavigationItemsProps {
  activeSection: string;
  onSectionChange: (section: "dashboard" | "people" | "analytics" | "settings") => void;
  onViewChange: () => void;
}

export const NavigationItems = ({
  activeSection,
  onSectionChange,
  onViewChange,
}: NavigationItemsProps) => {
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

  const handleDefaultItemClick = (section: "dashboard" | "people" | "analytics" | "settings") => {
    onSectionChange(section);
    onViewChange();
  };

  return (
    <>
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
    </>
  );
};