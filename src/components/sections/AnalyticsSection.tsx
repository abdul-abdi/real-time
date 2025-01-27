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
  LineChart,
  Line,
  Legend,
} from "recharts";
import { ChartPie, TrendingUp, Activity, AlertTriangle } from "lucide-react";

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

  // Trend data (simulated for last 6 months)
  const trendData = [
    { month: 'Jan', red: 4, amber: 6, green: 8 },
    { month: 'Feb', red: 3, amber: 7, green: 8 },
    { month: 'Mar', red: 5, amber: 5, green: 8 },
    { month: 'Apr', red: 2, amber: 8, green: 8 },
    { month: 'May', red: 3, amber: 6, green: 9 },
    { month: 'Jun', red: 4, amber: 5, green: 9 },
  ];

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
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Department Performance</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="avgRisk" fill="#6366f1" name="Danger Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <ChartPie className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Project Status Distribution</h3>
          </div>
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

        <Card className="p-6 lg:col-span-2 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Project Status Trends</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="red" stroke={COLORS.red} name="Critical" />
                <Line type="monotone" dataKey="amber" stroke={COLORS.amber} name="At Risk" />
                <Line type="monotone" dataKey="green" stroke={COLORS.green} name="Healthy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Department Details</h3>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentData.map((dept) => (
                <div
                  key={dept.name}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                >
                  <h4 className="font-medium">{dept.name}</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Total Projects: {dept.total}</p>
                    <p className="text-rag-red">Critical: {dept.red}</p>
                    <p className="text-rag-amber">At Risk: {dept.amber}</p>
                    <p className="text-rag-green">Healthy: {dept.green}</p>
                    <p className="font-medium mt-2">
                      Avg Danger Score: {dept.avgRisk}
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