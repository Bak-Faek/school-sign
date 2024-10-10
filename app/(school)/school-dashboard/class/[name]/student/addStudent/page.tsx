// components
import AddStudentForm from "@/components/forms/addStudentForm";
import React from "react";
import { Separator } from "@/components/ui/separator";

export default function AddStudentPage() {
  return (
    <div className="h-full w-full px-10 pb-16">
      <h1 className="text-2xl font-bold tracking-tight py-8">
        Add a Student
      </h1>

      <Separator />
      <div className="flex items-center justify-center mt-10">
        <AddStudentForm />
      </div>
    </div>
  );
}
