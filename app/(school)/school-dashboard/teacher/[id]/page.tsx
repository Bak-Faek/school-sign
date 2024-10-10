"use client";

// react
import { useState, useEffect } from "react";
import React from "react";

// next
import Link from "next/link";

// component
import SelectMenu from "@/components/SelectMenu";

// ui
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ModifyIcon } from "@/components/icons/ModifyIcon";

interface Teacher {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  classId?: string | null;
}

interface ClassSection {
  id: string;
  name: string;
}

export default function StudentDetails({
  params,
}: {
  params: { id: string; className: string };
}) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classData, setClassData] = useState<ClassSection[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassSection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`/api/student?id=${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setTeacher(data.user || null);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching the student."
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [params.id]);

  // Fetch class data
  useEffect(() => {
    const fetchClassData = async () => {
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
            errorData.error || "An error occurred while fetching classes."
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchClassData();
  }, []);

  // Function to get the class name based on teacher's classId
  const getClassName = () => {
    if (teacher?.classId && classData.length > 0) {
      const classSection = classData.find((cls) => cls.id === teacher.classId);
      return classSection ? classSection.name : "Class not found";
    }
    return null;
  };

  const className = getClassName();

  const handleUpdate = async () => {
    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }

    try {
      const res = await fetch(`/api/teacher?id=${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ classId: selectedClass.id }),
      });

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "The teacher has been assigned to the selected class",
          duration: 2000,
        });
        const updatedTeacher = await res.json();
        setTeacher(updatedTeacher);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(
          errorData.error || "An error occurred while updating the class."
        );
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="h-full w-full px-10 pb-16 ">
      <div className="space-y-0.5 py-8 ">
        <h1 className="text-2xl font-bold tracking-tight">Teacher</h1>
        <p className="text-muted-foreground">informations.</p>
        <Separator />
      </div>
      <div className="flex flex-col items-center h-full">
        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p className="h-full w-full flex items-center justify-center">
            Loading...
          </p>
        ) : (
          <>
            {teacher ? (
              <div className="w-full h-full flex  flex-col items-center ">
                <Card className="sm:w-full md:w-5/12 mt-10 flex flex-col justify-center items-center relative p-6">
                  <div className="flex sm:flex-col md:flex-row p-3 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                    <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                      {`Firstname :`}
                    </CardContent>
                    <CardContent className="h-8  p-0 overflow-x-scroll">
                      {`${teacher.firstname}`}
                    </CardContent>
                  </div>
                  <div className="flex sm:flex-col md:flex-row p-3 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                    <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                      {`Firstname :`}
                    </CardContent>
                    <CardContent className="h-8  p-0 overflow-x-scroll">
                      {`${teacher.lastname}`}
                    </CardContent>
                  </div>
                  <div className="flex sm:flex-col md:flex-row p-3 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                    <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                      {`Email :`}
                    </CardContent>
                    <CardContent className="h-8  p-0 overflow-x-scroll">
                      {`${teacher.email}`}
                    </CardContent>
                  </div>
                  <Link
                    className="absolute right-0 top-0 p-3"
                    href={`/school-dashboard/teacher//${teacher.id}/update`}
                  >
                    <button><ModifyIcon/></button>
                  </Link>
                </Card>
                <div className="flex flex-col items-center justify-center mt-10">
                  {teacher?.classId ? (
                    <p>
                      Assigned Class:{" "}
                      <Link
                        href={`/school-dashboard/class/${className}/student/`}
                      >
                        {getClassName()}
                      </Link>
                    </p>
                  ) : (
                    <>
                      <SelectMenu
                        selected={selectedClass}
                        setSelected={setSelectedClass}
                        options={classData}
                        displayValue={(classSection) => classSection.name}
                        label="Select a Class"
                      />
                      <Button onClick={handleUpdate} className="mt-4">
                        Update
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="h-full w-full flex items-center justify-center">
                No teacher found with this ID.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
