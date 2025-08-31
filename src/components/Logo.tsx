import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  icon?: LucideIcon;
  href?: string;
  className?: string;
  showSubtitle?: boolean;
}

export function Logo({ 
  icon: Icon, 
  href = "/", 
  className = "",
  showSubtitle = true 
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center space-x-3 group ${className}`}>
      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
        {Icon ? (
          <Icon className="h-6 w-6 text-primary" />
        ) : (
          <div className="h-6 w-6 bg-primary rounded" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">
          BookMyService
        </span>
        {showSubtitle && (
          <span className="text-xs text-muted-foreground -mt-1">
            crafted with love by WEBPROSHUB
          </span>
        )}
      </div>
    </Link>
  );
}
