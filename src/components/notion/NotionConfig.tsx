
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotion } from "@/hooks/useNotion";
import { Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const NotionConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [projectsDatabaseId, setProjectsDatabaseId] = useState("");
  const [statusDatabaseId, setStatusDatabaseId] = useState("");
  const [updatesDatabaseId, setUpdatesDatabaseId] = useState("");
  const { 
    configureNotion, 
    isConfigured, 
    isConfiguring, 
    isUsingFallbackData,
    validationErrors,
    validationInProgress,
    validateCredentials
  } = useNotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey && projectsDatabaseId && statusDatabaseId && updatesDatabaseId) {
      configureNotion(apiKey, projectsDatabaseId, statusDatabaseId, updatesDatabaseId);
    }
  };

  const handleValidateCredentials = async () => {
    if (apiKey && projectsDatabaseId && statusDatabaseId && updatesDatabaseId) {
      await validateCredentials(apiKey, projectsDatabaseId, statusDatabaseId, updatesDatabaseId);
    }
  };

  // This component is no longer shown by default since we've hardcoded credentials
  if (isConfigured && !isUsingFallbackData) {
    return null;
  }

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">
          {isUsingFallbackData 
            ? "Reconnect to Notion" 
            : "Configure Notion Integration"}
        </h2>
        
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Validation errors:</div>
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
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
            disabled={isConfiguring || validationInProgress}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="projectsDatabaseId" className="text-sm font-medium">
            Projects Database ID
          </label>
          <Input
            id="projectsDatabaseId"
            value={projectsDatabaseId}
            onChange={(e) => setProjectsDatabaseId(e.target.value)}
            placeholder="Enter your Projects database ID"
            disabled={isConfiguring || validationInProgress}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="statusDatabaseId" className="text-sm font-medium">
            Project Status Database ID
          </label>
          <Input
            id="statusDatabaseId"
            value={statusDatabaseId}
            onChange={(e) => setStatusDatabaseId(e.target.value)}
            placeholder="Enter your Project Status database ID"
            disabled={isConfiguring || validationInProgress}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="updatesDatabaseId" className="text-sm font-medium">
            Project Updates Database ID
          </label>
          <Input
            id="updatesDatabaseId"
            value={updatesDatabaseId}
            onChange={(e) => setUpdatesDatabaseId(e.target.value)}
            placeholder="Enter your Project Updates database ID"
            disabled={isConfiguring || validationInProgress}
          />
        </div>

        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline"
            className="flex-1" 
            onClick={handleValidateCredentials}
            disabled={isConfiguring || validationInProgress || !apiKey || !projectsDatabaseId || !statusDatabaseId || !updatesDatabaseId}
          >
            {validationInProgress ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Validate Credentials"
            )}
          </Button>
          
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={isConfiguring || validationInProgress || !apiKey || !projectsDatabaseId || !statusDatabaseId || !updatesDatabaseId}
          >
            {isConfiguring ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              isUsingFallbackData ? "Reconnect to Notion" : "Connect to Notion"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
