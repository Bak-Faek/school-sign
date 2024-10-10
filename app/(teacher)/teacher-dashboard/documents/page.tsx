"use client";

// components
import CardComponent from "@/components/card/CardComponent";
import { CardEl } from "@/components/card/cardTypes";
import { Separator } from "@/components/ui/separator";

export default function TeacherDocuments() {
  const elements: CardEl[] = [
    {
      name: "Schooling contract",
    },
    {
      name: "Schooling certificate",
    },
    {
      name: "Attendance sheet",
    },
    {
      name: "Authorisation to leave",
    },
  ];

  return (
    <div className="space-y-6 pl-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
      </div>
      <Separator />
      <div className="grid gap-6 px-6 justify-center xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CardComponent elements={elements} />
      </div>
    </div>
  );
}
