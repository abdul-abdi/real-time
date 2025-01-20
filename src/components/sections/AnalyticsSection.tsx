import { mockProjects } from "@/data/mockProjects";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const AnalyticsSection = () => {
  // Calculate department statistics
  const departmentStats = mockProjects.reduce((acc, project) => {
    project.departments.forEach(dept => {
      if (!acc[dept]) {
        acc[dept] = {
          name: dept,
          total: 0,
          red: 0,
          amber: 0,
          green: 0,
          avgRisk: 0,
          projects: [],
        };
      }
      acc[dept].total += 1;
      acc[dept].projects.push(project);
      acc[dept][project.ragStatus] += 1;
      acc[dept].avgRisk += project.dangerScore;
    });
    return acc;
  }, {} as Record<string, any>);

  // Calculate final averages
  Object.values(departmentStats).forEach(stat => {
    stat.avgRisk = +(stat.avgRisk / stat.total).toFixed(1);
  });

  const departmentData = Object.values(departmentStats);

  // RAG status distribution for pie chart
  const ragDistribution = mockProjects.reduce((acc, project) => {
    acc[project.ragStatus] = (acc[project.ragStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(ragDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = {
    red: "#ef4444",
    amber: "#f59e0b",
    green: "#22c55e",
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
        <p className="text-muted-foreground mt-2">
          Comprehensive analysis of project performance across departments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgRisk" fill="#6366f1" name="Risk Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Department Details</h3>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentData.map((dept) => (
                <div
                  key={dept.name}
                  className="p-4 rounded-lg border bg-card"
                >
                  <h4 className="font-medium">{dept.name}</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Total Projects: {dept.total}</p>
                    <p className="text-rag-red">Critical: {dept.red}</p>
                    <p className="text-rag-amber">At Risk: {dept.amber}</p>
                    <p className="text-rag-green">Healthy: {dept.green}</p>
                    <p className="font-medium mt-2">
                      Avg Risk Score: {dept.avgRisk}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};