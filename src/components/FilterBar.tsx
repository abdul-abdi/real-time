import { Filter, SlidersHorizontal } from "lucide-react";
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
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center gap-4 py-4">
        <Button variant="outline" size="sm" className="hover:bg-muted">
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
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="danger">Danger Score</SelectItem>
            <SelectItem value="name">Project Name</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" className="ml-auto">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </div>
    </div>
  );
};