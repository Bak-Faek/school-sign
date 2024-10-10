// components
import AddClassForm from "@/components/forms/addClassForm";
import React from "react";
import { Separator } from "@/components/ui/separator";

export default function SchoolDashboard() {
  return (
    <div className="h-full w-full px-10 pb-16 ">
      <h1 className="text-2xl font-bold tracking-tight py-8">Add a Class</h1>
      <Separator />
      <div className="flex items-center justify-center mt-20">
        <AddClassForm />
      </div>
    </div>
  );
}
