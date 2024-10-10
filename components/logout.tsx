"use client";

// next
import { useRouter } from "next/navigation";
import Link from "next/link";
// ui
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Logout() {
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (res.ok) {
      toast({
        className: "bg-green-400",
        description: "See you soon",
        duration: 2000,
      });
      router.push("/");
    } else {
      toast({
        title: "Logout Error",
        description: "Error during disconnection. Please try again.",
      });
    }
  };

  return (
    <>
      <Link
        href="#"
        onClick={handleLogout}
        className={
          isMobile
            ? cn(
                buttonVariants({ variant: "default", size: "default" }),
                "bg-red-700 hover:bg-red-600 w-28 px-0",
              )
            : cn(
                buttonVariants({ variant: "default", size: "default" }),
                "mt-3 bg-red-700 hover:bg-red-600 w-32",
              )
        }
      >
        <ExitIcon className="mr-2 h-4 w-4" />
        Logout
      </Link>
    </>
  );
}
