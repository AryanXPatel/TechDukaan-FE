"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 40, height = 40, className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show light version by default until mounted
  if (!mounted) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="8 13 26 26"
        fill="none"
        className={className}
        aria-label="TechDukaan Logo"
      >
        <path
          d="M 10 15 L 10 35 L 15 35 L 15 20 L 25 20 L 25 15 Z"
          fill="#1F2937"
        />
        <path
          d="M 20 25 L 20 35 L 30 35 L 30 30 L 25 30 L 25 25 Z"
          fill="#2563EB"
        />
        <circle cx="27.5" cy="17.5" r="2.5" fill="#00DC82" />
      </svg>
    );
  }

  // Dark mode version
  if (resolvedTheme === "dark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="8 13 26 26"
        fill="none"
        className={className}
        aria-label="TechDukaan Logo"
      >
        <rect x="8" y="13" width="26" height="26" fill="transparent" />
        <path
          d="M 10 15 L 10 35 L 15 35 L 15 20 L 25 20 L 25 15 Z"
          fill="#E5E7EB"
        />
        <path
          d="M 20 25 L 20 35 L 30 35 L 30 30 L 25 30 L 25 25 Z"
          fill="#3B82F6"
        />
        <circle cx="27.5" cy="17.5" r="2.5" fill="#10B981" />
      </svg>
    );
  }

  // Light mode version (default)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="8 13 26 26"
      fill="none"
      className={className}
      aria-label="TechDukaan Logo"
    >
      <path
        d="M 10 15 L 10 35 L 15 35 L 15 20 L 25 20 L 25 15 Z"
        fill="#1F2937"
      />
      <path
        d="M 20 25 L 20 35 L 30 35 L 30 30 L 25 30 L 25 25 Z"
        fill="#2563EB"
      />
      <circle cx="27.5" cy="17.5" r="2.5" fill="#00DC82" />
    </svg>
  );
}
