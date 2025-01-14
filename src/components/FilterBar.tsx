import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FilterBar = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
      <Select>
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
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Time Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Last Week</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="quarter">Last Quarter</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};