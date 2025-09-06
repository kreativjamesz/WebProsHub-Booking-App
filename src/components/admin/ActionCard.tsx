"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ActionCardProps {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  clickable?: boolean;
  hover?: boolean;
  className?: string;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function ActionCard({
  title,
  subtitle,
  onClick,
  clickable = false,
  hover = true,
  className,
  actions,
  media,
  footer,
  children,
}: ActionCardProps) {
  const interactive = clickable && typeof onClick === "function";

  return (
    <Card
      className={cn(
        interactive ? "cursor-pointer" : undefined,
        hover ? "transition-shadow hover:shadow-md" : undefined,
        className
      )}
      onClick={interactive ? onClick : undefined}
    >
      {(title || subtitle || actions) && (
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            {title && <CardTitle className="text-base">{title}</CardTitle>}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </CardHeader>
      )}

      {media}

      <CardContent className="space-y-3">
        {children}
        {footer && <div className="pt-3 border-t text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  );
}


