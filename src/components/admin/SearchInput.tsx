"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  delay?: number; // Delay in milliseconds
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  delay = 500,
  className = "",
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounced onChange effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, onChange, delay]);

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={handleInputChange}
        className="pl-10"
      />
    </div>
  );
}
