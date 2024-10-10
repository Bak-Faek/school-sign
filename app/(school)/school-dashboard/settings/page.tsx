"use client";

import { Separator } from "@/components/ui/separator";
import Logout from "@/components/logout";
import { useIsMobile } from "@/hooks/useIsMobile";

// next
import Link from "next/link";

// ui
import { Button } from "@/components/ui/button";
import React from "react";

export default function SchoolSettings() {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="h-full w-full px-10 pb-16 ">
        <div className="space-y-0.5 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account.
              </p>
            </div>
          </div>
        <Separator />
        </div>
        <div className="flex flex-col w-36 gap-5">
          <Button className="bg-purple text-seasame" variant="outline">
            <Link href="/school-dashboard/settings/profil">
              School informations
            </Link>
          </Button>
          {isMobile && <Logout />}
        </div>
      </div>
    </>
  );
}
