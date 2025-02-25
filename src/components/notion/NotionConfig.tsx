
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotion } from "@/hooks/useNotion";
import { Loader } from "lucide-react";

export const NotionConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const { configureNotion, isConfigured, isConfiguring } = useNotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey && databaseId) {
      configureNotion(apiKey, databaseId);
    }
  };

  if (isConfigured) {
    return null;
  }

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Configure Notion Integration</h2>
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            Notion API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Notion API key"
            disabled={isConfiguring}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="databaseId" className="text-sm font-medium">
            Database ID
          </label>
          <Input
            id="databaseId"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
            placeholder="Enter your Notion database ID"
            disabled={isConfiguring}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isConfiguring || !apiKey || !databaseId}
        >
          {isConfiguring ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect to Notion"
          )}
        </Button>
      </form>
    </Card>
  );
};
