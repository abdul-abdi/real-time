import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  totalProjects: number;
  criticalIssues: number;
  healthyProjects: number;
  recentUpdates: number;
}

export const StatsOverview = ({
  totalProjects,
  criticalIssues,
  healthyProjects,
  recentUpdates,
}: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
            <h3 className="text-2xl font-bold mt-1">{totalProjects}</h3>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <ArrowUp className="h-4 w-4 text-rag-green mr-1" />
          <span className="text-rag-green">12% increase</span>
          <span className="text-muted-foreground ml-2">from last month</span>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
            <h3 className="text-2xl font-bold mt-1 text-rag-red">{criticalIssues}</h3>
          </div>
          <div className="h-12 w-12 bg-rag-red/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-rag-red" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <ArrowDown className="h-4 w-4 text-rag-green mr-1" />
          <span className="text-rag-green">3% decrease</span>
          <span className="text-muted-foreground ml-2">from last week</span>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Healthy Projects</p>
            <h3 className="text-2xl font-bold mt-1 text-rag-green">{healthyProjects}</h3>
          </div>
          <div className="h-12 w-12 bg-rag-green/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-rag-green" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <ArrowUp className="h-4 w-4 text-rag-green mr-1" />
          <span className="text-rag-green">8% increase</span>
          <span className="text-muted-foreground ml-2">from last week</span>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent Updates</p>
            <h3 className="text-2xl font-bold mt-1">{recentUpdates}</h3>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-muted-foreground">Last 24 hours</span>
        </div>
      </Card>
    </div>
  );
};