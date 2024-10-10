"use client";

// next
import Link from "next/link";
import { usePathname } from "next/navigation";

// component
import { NavProps } from "@/components/navigation/components/navTypes";

// ui
import { cn } from "@/lib/utils";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import { buttonVariants } from "@/components/ui/button";

export default function BottomNav({ links }: NavProps) {
  const pathname = usePathname();

  return (
    <Menubar className="fixed z-50 bottom-0 h-auto w-full justify-evenly border-none shadow-none dark:bg-black">
      {links.map((link, index) => {
        const isActive = pathname === link.href;

        return (
          <MenubarMenu key={index}>
            <Link
              href={link.href ?? "#"} // fallback to # if href is not defined
              className={cn(
                buttonVariants({ variant: link.variant, size: "default" }),
                "flex flex-col items-center h-full w- py-1 m-1",
                isActive
                  ? "bg-primary text-white hover:bg-accent-foreground hover:text-white"
                  : "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
              )}
            >
              <link.icon className="h-4 w-4" />
              <small>{link.name}</small>
            </Link>
          </MenubarMenu>
        );
      })}
    </Menubar>
  );
}
