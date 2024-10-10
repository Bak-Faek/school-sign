"use client";

import ClassWithSignatures from "@/components/ClassWithSignatures/ClassWithSignatures";
import { Separator } from "@/components/ui/separator";

export default function TeacherClass() {
  return (
    <div className="h-full w-full sm:px-0 md:px-10 pb-16  ">
      <div className="space-y-0.5 sm:px-10 md:px-0 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">Consult School Classes.</p>
        <Separator />
      </div>
      <ClassWithSignatures />
    </div>
  );
}
