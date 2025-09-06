"use client";

import React from "react";

interface AdminPageContainerProps {
  children: React.ReactNode;
  /** Optional: overrides max width (defaults to max-w-screen-2xl) */
  maxWidthClassName?: string;
  /** Optional: toggles background color wrapper (defaults to true) */
  withBackground?: boolean;
  /** Optional: extra class to merge on the inner container */
  className?: string;
}

export function AdminPageContainer({
  children,
  maxWidthClassName = "max-w-screen-2xl",
  withBackground = true,
  className = "",
}: AdminPageContainerProps) {
  return (
    <div className={withBackground ? "min-h-screen bg-background" : ""}>
      <div
        className={`${maxWidthClassName} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}


