"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

export function DashboardNav({ items, setOpen }) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={item.soon ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.soon && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
                {item.soon && (
                  <Badge className="ml-auto text-xs font-semibold">Soon</Badge>
                )}
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
