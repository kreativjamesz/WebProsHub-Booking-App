"use client";

import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type TableColumn<TItem extends object> = {
  header: string;
  headerClassName?: string;
  className?: string;
  accessor?: keyof TItem | ((item: TItem) => ReactNode);
  cell?: (item: TItem) => ReactNode;
};

export interface AdminDataTableProps<TItem extends object> {
  items: TItem[];
  columns: Array<TableColumn<TItem>>;
  keyExtractor?: (item: TItem, index: number) => string;
  isLoading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
  onRowClick?: (item: TItem) => void;
  rowClassName?: string | ((item: TItem) => string);
  highlightOnHover?: boolean;
  renderActions?: (item: TItem) => ReactNode;
  actionsHeader?: string;
}

export function AdminDataTable<TItem extends object>({
  items,
  columns,
  keyExtractor,
  isLoading = false,
  loadingContent,
  emptyContent,
  onRowClick,
  rowClassName,
  highlightOnHover = true,
  renderActions,
  actionsHeader = "Actions",
}: AdminDataTableProps<TItem>) {
  const colSpan = columns.length + (renderActions ? 1 : 0);

  const getCellContent = (item: TItem, col: TableColumn<TItem>): ReactNode => {
    if (col.cell) return col.cell(item);
    if (typeof col.accessor === "function") return col.accessor(item);
    if (typeof col.accessor === "string") {
      const value = (item as Record<string, unknown>)[col.accessor];
      return value as ReactNode;
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead key={`h-${idx}`} className={col.headerClassName}>
              {col.header}
            </TableHead>
          ))}
          {renderActions && <TableHead>{actionsHeader}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={colSpan} className="py-8 text-center">
              {loadingContent || "Loading..."}
            </TableCell>
          </TableRow>
        ) : items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={colSpan}
              className="py-8 text-center text-muted-foreground"
            >
              {emptyContent || "No data found"}
            </TableCell>
          </TableRow>
        ) : (
          items.map((item, index) => {
            const rowKey = keyExtractor
              ? keyExtractor(item, index)
              : String(index);
            const clickable = typeof onRowClick === "function";
            const hoverClass =
              clickable && highlightOnHover ? "hover:bg-muted/50" : undefined;
            const baseClass = clickable ? "cursor-pointer" : undefined;
            const extraClass =
              typeof rowClassName === "function"
                ? rowClassName(item)
                : rowClassName;

            return (
              <TableRow
                key={rowKey}
                className={[hoverClass, baseClass, extraClass]
                  .filter(Boolean)
                  .join(" ")}
                onClick={clickable ? () => onRowClick?.(item) : undefined}
              >
                {columns.map((col, cidx) => (
                  <TableCell
                    key={`c-${rowKey}-${cidx}`}
                    className={col.className}
                  >
                    {getCellContent(item, col)}
                  </TableCell>
                ))}
                {renderActions && <TableCell>{renderActions(item)}</TableCell>}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
