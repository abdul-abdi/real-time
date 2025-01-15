import { Bell, ChevronDown, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header = ({ onSearch, searchQuery }: HeaderProps) => {
  const { toast } = useToast();
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock suggestions - in a real app, these would come from your backend
  const suggestions = [
    "Project Alpha",
    "Project Beta",
    "Critical Status Updates",
    "Recent Red Projects",
  ];

  // Mock notifications - in a real app, these would come from your backend
  const notifications = [
    {
      id: 1,
      title: "Project Status Change",
      description: "Project Alpha changed from Green to Red",
      time: "5 minutes ago",
    },
    {
      id: 2,
      title: "Overdue Update",
      description: "Project Beta requires status update",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "New Comment",
      description: "New comment added to Project Gamma",
      time: "2 hours ago",
    },
  ];

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleProfileAction = (action: string) => {
    toast({
      title: action,
      description: `${action} action triggered`,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            RAG Dashboard
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                onSearch(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              className="h-10 w-[300px] rounded-md border bg-background pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
            />
            {showSearchSuggestions && searchQuery && (
              <div className="absolute top-full left-0 w-full mt-1 bg-background rounded-md border shadow-lg animate-in fade-in-0 zoom-in-95">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-muted text-sm"
                    onClick={() => {
                      onSearch(suggestion);
                      setShowSearchSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-primary/10 transition-colors"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rag-red text-[10px] text-white flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            </Button>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>Recent updates and alerts</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card text-card-foreground transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "Notification dismissed",
                          description: "The notification has been removed",
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 transition-colors"
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction("Profile")}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction("Preferences")}>
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction("Help")}>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction("Sign out")}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};