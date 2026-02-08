"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackedLinkProps extends LinkProps {
  className?: string;
  children: ReactNode;
  eventName: string;
  eventPayload?: Record<string, string | number | boolean | null | undefined>;
}

export default function TrackedLink({
  className,
  children,
  eventName,
  eventPayload,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      className={className}
      onClick={() => trackEvent(eventName, eventPayload)}
    >
      {children}
    </Link>
  );
}
