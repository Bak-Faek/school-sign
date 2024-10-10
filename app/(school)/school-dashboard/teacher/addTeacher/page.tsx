// components
import AddTeacherForm from "@/components/forms/addTeacherForm";
import { Separator } from "@/components/ui/separator";

export default function SchoolDashboard() {
  return (
    <div className="h-full w-full px-10 pb-16 ">
      <h1 className="text-2xl font-bold tracking-tight py-8">Add a teacher</h1>
      <Separator />
      <div className="flex items-center justify-center mt-20">
        <AddTeacherForm />
      </div>
    </div>
  );
}
