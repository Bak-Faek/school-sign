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
import { ModifyIcon } from "@/components/icons/ModifyIcon";

export default function ClassList() {
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
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
            errorData.error || "An error occurred while fetching classes"
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
      <div className="h-full w-full px-10 pb-16 ">
        <div className="space-y-0.5 py-8 ">
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Consult School Classes.</p>
          <Separator />
        </div>
        <div className="flex flex-col items-center h-full">
          {error && <p className="text-red-500">{error}</p>}

          {loading ? (
            <p className="h-full w-full flex items-center justify-center">
              Loading...
            </p>
          ) : classData.length > 0 ? (
            <div>
              <ul>
                {classData.map((cls: any) => (
                  <li key={cls.id}>
                    <Card className="w-72 mt-5">
                      <CardHeader className="relative">
                        <CardTitle className="flex gap-2 flex-wrap justify-center">
                          <Link
                            href={`/school-dashboard/class/${cls.name}/student/`}
                          >
                            <button>{cls.name}</button>
                          </Link>

                          <Link
                            className="absolute right-0 top-0 p-3"
                            href={`/school-dashboard/class/${cls.name}/update`}
                          >
                            <button>
                              <ModifyIcon />
                            </button>
                          </Link>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center justify-center gap-4 p-4 md:p-10">
                <Button className="bg-purple text-seasame" variant="outline">
                  <Link href="/school-dashboard/class/addClass">
                    Add a new class
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="h-full w-full flex items-center justify-center">
                No classes found.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 p-4 md:p-10">
                <Button className="bg-purple text-seasame" variant="outline">
                  <Link href="/school-dashboard/class/addClass">
                    Add a new class
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
