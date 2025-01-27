import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const SettingsSection = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState("7");
  const [updateFrequency, setUpdateFrequency] = useState("daily");
  const [defaultView, setDefaultView] = useState("grid");
  const [itemsPerPage, setItemsPerPage] = useState("12");
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('displaySettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDefaultView(settings.defaultView || "grid");
      setItemsPerPage(settings.itemsPerPage || "12");
      setEmailNotifications(settings.emailNotifications ?? true);
      setSlackNotifications(settings.slackNotifications ?? true);
      setRiskThreshold(settings.riskThreshold || "7");
      setUpdateFrequency(settings.updateFrequency || "daily");
    }
  }, []);

  const handleSave = () => {
    const settings = {
      defaultView,
      itemsPerPage,
      emailNotifications,
      slackNotifications,
      riskThreshold,
      updateFrequency,
    };
    localStorage.setItem('displaySettings', JSON.stringify(settings));
    
    // Dispatch an event to notify other components about the view change
    window.dispatchEvent(new CustomEvent('viewSettingsChanged', { 
      detail: { view: defaultView }
    }));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your preferences and notification settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive project updates via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Slack Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive project updates via Slack
                </p>
              </div>
              <Switch
                checked={slackNotifications}
                onCheckedChange={setSlackNotifications}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Alert Preferences</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Risk Score Threshold</Label>
              <Select
                value={riskThreshold}
                onValueChange={setRiskThreshold}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 - Moderate Risk</SelectItem>
                  <SelectItem value="7">7 - High Risk</SelectItem>
                  <SelectItem value="9">9 - Critical Risk</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Get notified when projects exceed this risk score
              </p>
            </div>

            <div className="space-y-2">
              <Label>Update Frequency</Label>
              <Select
                value={updateFrequency}
                onValueChange={setUpdateFrequency}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How often you want to receive updates
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Default View</Label>
              <Select value={defaultView} onValueChange={setDefaultView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="kanban">Kanban View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items Per Page</Label>
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 items</SelectItem>
                  <SelectItem value="12">12 items</SelectItem>
                  <SelectItem value="24">24 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};
