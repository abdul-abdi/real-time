import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <a
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </a>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.href ? (
            <a
              href={item.href}
              className={cn(
                "hover:text-foreground transition-colors",
                index === items.length - 1 && "text-foreground font-medium"
              )}
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                index === items.length - 1 && "text-foreground font-medium"
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};