import { mockProjects } from "@/data/mockProjects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
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
  // Calculate RAG status distribution
  const ragDistribution = mockProjects.reduce(
    (acc, project) => {
      acc[project.ragStatus]++;
      return acc;
    },
    { red: 0, amber: 0, green: 0 }
  );

  const pieData = [
    { name: "Red", value: ragDistribution.red, color: "#FF4D4F" },
    { name: "Amber", value: ragDistribution.amber, color: "#FAAD14" },
    { name: "Green", value: ragDistribution.green, color: "#52C41A" },
  ];

  // Mock trend data (in a real app, this would come from an API)
  const trendData = [
    { month: "Jan", dangerScore: 5 },
    { month: "Feb", dangerScore: 4 },
    { month: "Mar", dangerScore: 6 },
    { month: "Apr", dangerScore: 3 },
    { month: "May", dangerScore: 2 },
  ];

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-2">
          Project performance metrics and insights
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>RAG Status Distribution</CardTitle>
            <CardDescription>Current project health overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Score Trend</CardTitle>
            <CardDescription>Average project risk over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="dangerScore"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};