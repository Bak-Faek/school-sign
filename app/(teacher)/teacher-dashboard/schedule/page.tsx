"use client";

// components
import CalendarTest from "@/components/calendar/CalendarTest";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function TeacherSchedule() {
  return (
    <>
      <div className="h-full w-full sm:px-0 md:px-10 pb-16  ">
        <div className="space-y-0.5 pb-6 sm:px-10 md:px-0">
          <h1 className="text-2xl font-bold tracking-tight pb-6">Schedule</h1>
        <Separator />
        </div>
        <div className="w-full pt-6 ">
          <CalendarTest />
        </div>
      </div>
    </>
  );
}
