import { useState, useMemo } from "react";
import { Project } from "@/types/project";

export const useProjectFilters = (projects: Project[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ragFilter, setRagFilter] = useState<string>("all");
  const [timePeriod, setTimePeriod] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.owners.some(owner => 
            owner.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesRag = ragFilter === "all" || project.ragStatus === ragFilter;

        const matchesDepartments = 
          selectedDepartments.length === 0 || 
          project.departments.some(dept => selectedDepartments.includes(dept));

        // Time period filtering logic
        const lastUpdatedDate = new Date(project.lastUpdated);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        let matchesTime = true;
        switch (timePeriod) {
          case "week":
            matchesTime = daysDiff <= 7;
            break;
          case "month":
            matchesTime = daysDiff <= 30;
            break;
          case "quarter":
            matchesTime = daysDiff <= 90;
            break;
          case "year":
            matchesTime = daysDiff <= 365;
            break;
          default:
            matchesTime = true;
        }

        return matchesSearch && matchesRag && matchesTime && matchesDepartments;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "updated":
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
          case "danger":
            return b.dangerScore - a.dangerScore;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [projects, searchQuery, ragFilter, timePeriod, sortBy, selectedDepartments]);

  return {
    searchQuery,
    setSearchQuery,
    ragFilter,
    setRagFilter,
    timePeriod,
    setTimePeriod,
    sortBy,
    setSortBy,
    selectedDepartments,
    setSelectedDepartments,
    filteredProjects,
  };
};