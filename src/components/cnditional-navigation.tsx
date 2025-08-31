"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";

export function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Hide navigation on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Navigation />;
}
