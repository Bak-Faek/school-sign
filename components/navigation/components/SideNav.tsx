"use client";

// next
import Link from "next/link";
import { usePathname } from "next/navigation";

// ui
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NavProps } from "@/components/navigation/components/navTypes";
import Logout from "@/components/logout";
import React from "react";

export default function SideNav({ links }: NavProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col items-center gap-2 py-8 px-4 border-r h-screen w-fit">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={index}
              href={link.href ?? "#"} // fallback to # if href is not defined
              className={cn(
                buttonVariants({ variant: link.variant, size: "default" }),
                "w-32",
                isActive
                  ? "bg-primary text-white hover:bg-accent-foreground hover:text-white"
                  : "dark:bg-muted dark:text-muted-foreground ",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.name && (
                <span
                  className={cn(
                    "mr-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white",
                  )}
                >
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
        <Logout />
      </div>
    </>
  );
}
