import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { departments } from "@/data/mockProjects";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  onRagFilterChange: (value: string) => void;
  onTimePeriodChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onDepartmentsChange: (departments: string[]) => void;
  ragFilter: string;
  timePeriod: string;
  sortBy: string;
  selectedDepartments: string[];
}

export const FilterBar = ({
  onRagFilterChange,
  onTimePeriodChange,
  onSortByChange,
  onDepartmentsChange,
  ragFilter,
  timePeriod,
  sortBy,
  selectedDepartments,
}: FilterBarProps) => {
  const { toast } = useToast();

  const handleDepartmentToggle = (department: string) => {
    if (selectedDepartments.includes(department)) {
      onDepartmentsChange(selectedDepartments.filter(d => d !== department));
    } else {
      onDepartmentsChange([...selectedDepartments, department]);
    }
  };

  return (
    <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-wrap items-center gap-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {departments.map((department) => (
            <Button
              key={department}
              variant={selectedDepartments.includes(department) ? "default" : "outline"}
              size="sm"
              onClick={() => handleDepartmentToggle(department)}
              className="hover:bg-muted transition-colors"
            >
              <Checkbox
                checked={selectedDepartments.includes(department)}
                className="mr-2 h-4 w-4"
              />
              {department}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 ml-auto">
          <Select value={ragFilter} onValueChange={onRagFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="RAG Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="amber">Amber</SelectItem>
              <SelectItem value="green">Green</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timePeriod} onValueChange={onTimePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="danger">Danger Score</SelectItem>
              <SelectItem value="name">Project Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};