import "../../globals.css";
import React from "react";
import { ClassProvider } from "@/components/context/ClassContext";
import StudentNavBar from "@/components/navigation/StudentNavBar";
import { Toaster } from "@/components/ui/toaster";
import RealTimeClockWithDate from "@/components/calendar/CurrentTime";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="sm:flex bg-seasame h-screen">
      <div className="absolute top-0 right-0 sm:mt-10 sm:mr-2 md:mr-10 ">
        <RealTimeClockWithDate />
      </div>
      <ClassProvider>
        <nav>
          <StudentNavBar />
        </nav>
        <main className="w-full scroll">
          <div className="h-screen py-8 w-full">{children}</div>
        </main>
        <Toaster />
      </ClassProvider>
    </div>
  );
}
