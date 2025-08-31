import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  } | string;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  description,
  trend,
}: StatCardProps) {
  const renderTrend = () => {
    if (!trend) return null;
    
    if (typeof trend === 'string') {
      return (
        <span className="text-sm font-medium text-green-600">
          {trend}
        </span>
      );
    }
    
    return (
      <span
        className={`text-sm font-medium ${
          trend.isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {trend.isPositive ? "+" : ""}{trend.value}%
      </span>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{value}</p>
              {renderTrend()}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
