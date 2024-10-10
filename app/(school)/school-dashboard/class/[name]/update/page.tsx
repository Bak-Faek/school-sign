// components
import UpdateClassForm from "@/components/forms/updateClassForm";
import { Separator } from "@/components/ui/separator";

export default function SchoolDashboard() {
  return (
    <div className="h-full w-full px-10 pb-16 ">
    <div className="space-y-0.5 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Class</h1>
      <p className="text-muted-foreground">Update informations.</p>
    <Separator />
    </div>
      <div className="flex items-center justify-center">
        <UpdateClassForm />
      </div>
    </div>
  );
}
