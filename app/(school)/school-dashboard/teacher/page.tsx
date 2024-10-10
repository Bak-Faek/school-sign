"use client";

// react
import { useState, useEffect } from "react";

// next
import Link from "next/link";

// ui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
}

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/teacher", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setTeachers(data.users || []);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching teachers"
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className=" w-full px-10 ">
        <div className="space-y-0.5 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight pb-6">Teachers</h1>
          </div>
          <Separator />
        </div>
      </div>

      <div className="flex justify-center h-full">
        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p className="h-full w-full flex items-center justify-center">Loading...</p>
        ) : teachers.length > 0 ? (
          <div>
            <ul className="space-y-4">
              {teachers.map((teacher) => (
                <li key={teacher.id}>
                  <Card className="w-72 text-center">
                    <CardHeader>
                      <CardTitle>
                        <Link href={`/school-dashboard/teacher/${teacher.id}`}>
                          <button>
                            {`${teacher.firstname} ${teacher.lastname}`}
                          </button>
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center flex-col gap-4 p-4 md:p-10">
              <Button className="bg-purple text-seasame" variant="outline">
                <Link href="/school-dashboard/teacher/addTeacher">
                  Add a new Teacher
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <p className="h-full w-full flex items-center justify-center">No teachers found.</p>
        )}
      </div>
    </>
  );
}
