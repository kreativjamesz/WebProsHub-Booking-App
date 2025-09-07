"use client";

import React, { ReactNode } from "react";
import { StatCard } from "./StatCard";
import { ActionCard, type ActionCardProps } from "./ActionCard";

type StatCardItem = {
  type: "stat";
  title: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
};

type ActionCardItem = {
  type: "action";
  props: Omit<ActionCardProps, "children"> & {
    content?: ReactNode;
  };
};

export type AdminCardGridItem = StatCardItem | ActionCardItem;

interface AdminCardGridProps {
  items: AdminCardGridItem[];
  className?: string;
  /** grid columns at breakpoints */
  cols?: {
    base?: number;
    md?: number;
    lg?: number;
  };
  gapClassName?: string;
}

export function AdminCardGrid({
  items,
  className = "",
  cols = { base: 1, md: 2, lg: 4 },
  gapClassName = "gap-6",
}: AdminCardGridProps) {
  const baseCols = cols.base ?? 1;
  const mdCols = cols.md ?? 2;
  const lgCols = cols.lg ?? 4;

  const gridClassName = `grid grid-cols-1 md:grid-cols-${mdCols} lg:grid-cols-${lgCols} ${gapClassName} ${className}`;

  return (
    <div
      className={gridClassName.replace("grid-cols-1", `grid-cols-${baseCols}`)}
    >
      {items.map((item, index) => {
        if (item.type === "stat") {
          const { title, value, icon, className: c } = item;
          return (
            <StatCard
              key={`stat-${index}`}
              title={title}
              value={value}
              icon={icon}
              className={c}
            />
          );
        }
        const { content, ...rest } = item.props;
        return (
          <ActionCard key={`action-${index}`} {...rest}>
            {content}
          </ActionCard>
        );
      })}
    </div>
  );
}
