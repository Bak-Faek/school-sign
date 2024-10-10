"use client";

// React
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { classSchema } from "@/lib/schemas/classSchema";

// UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/app/(school)/school-dashboard/class/[name]/student/page";

export default function UpdateClassForm() {
  const [name, setName] = useState("");
  const [classData, setClassData] = useState<Student[]>([]);
  const [userSchoolId, setUserSchoolId] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchoolId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();

          setUserSchoolId(data.user.schoolId);
        } else {
          console.error("Erreur lors de la récupération du classId");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du classId", error);
      }
    };

    fetchSchoolId();
  }, []);

  useEffect(() => {
    const fetchAllclasses = async () => {
      try {
        const res = await fetch("/api/class", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setClassData(data.classSections || []);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching teachers"
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchAllclasses();
  }, []);

  const getClassId = () => {
    if (classData.length > 0) {
      const classSection = classData.find(
        (cls) => cls.schoolId === userSchoolId
      );
      return classSection ? classSection.id : "Class not found";
    }
    return null;
  };

  const classId = getClassId();

  console.log(classId);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await fetch(`/api/class?id=${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          setName(data.classSection.name || []);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching classes"
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchClassData();
  }, [classId]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await fetch(`/api/class?id=${classId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(name),
        credentials: "include",
      });

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "New class added",
          duration: 2000,
        });
        router.back();
      } else {
        toast({
          title: "An error occurred while adding the class",
          description: "Please try again later",
          duration: 2000,
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-center">Update Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate}>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="classname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end items-center pt-6">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
