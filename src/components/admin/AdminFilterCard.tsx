"use client";

import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/admin/SearchInput";

type Option = { label: string; value: string };

export interface SearchConfig {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  className?: string;
}

export interface SelectConfig {
  id: string;
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  className?: string;
  triggerClassName?: string;
}

interface AdminFilterCardProps {
  title?: string;
  icon?: ReactNode;
  search?: SearchConfig;
  selects?: SelectConfig[];
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AdminFilterCard({
  title = "Filters & Search",
  icon,
  search,
  selects = [],
  actions,
  className,
  contentClassName,
}: AdminFilterCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>
        <div className="flex flex-row gap-4">
          <div className="left-side flex-1">
            {search && (
              <div className="flex-1">
                <SearchInput
                  placeholder={search.placeholder || "Search..."}
                  value={search.value}
                  onChange={search.onChange}
                  delay={search.delay}
                />
              </div>
            )}
          </div>
          <div className="right-side flex flex-row gap-4">
            {selects.map((sel) => (
              <div key={sel.id} className={sel.className || "w-full"}>
                {sel.label && (
                  <Label htmlFor={sel.id} className="text-sm font-medium">
                    {sel.label}
                  </Label>
                )}
                <Select value={sel.value} onValueChange={sel.onValueChange}>
                  <SelectTrigger className={sel.triggerClassName || "w-full"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sel.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
