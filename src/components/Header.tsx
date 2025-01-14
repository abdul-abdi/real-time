import { Bell, Search, User } from "lucide-react";
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

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header = ({ onSearch, searchQuery }: HeaderProps) => {
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
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
              onChange={(e) => onSearch(e.target.value)}
              className="h-10 w-[300px] rounded-md border bg-background pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-primary/10 transition-colors"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rag-red text-[10px] text-white flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 transition-colors"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction("Profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction("Settings")}>
                Settings
              </DropdownMenuItem>
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