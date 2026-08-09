"use client";

import Link from "next/link";
import { writeGuiVisited, writeSessionMode } from "@/lib/sessionMode";

type HomeLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Return to the interactive home in GUI mode (not terminal).
 * Content pages are part of the GUI browsing flow.
 */
export default function HomeLink({
  className,
  children = "← Home",
}: HomeLinkProps) {
  return (
    <Link
      href="/"
      className={className}
      onClick={() => {
        writeSessionMode("gui");
        writeGuiVisited(true);
      }}
    >
      {children}
    </Link>
  );
}
