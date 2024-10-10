"use client";

// react
import { useState, useEffect } from "react";
import React from "react";

// next
import Link from "next/link";

// ui
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SchoolDetails() {
  const [school, setSchool] = useState<any | null>(null);
  const [schoolId, setSchoolId] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(school);

  useEffect(() => {
    const fetchSchoolId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();

          setSchoolId(data.user.schoolId);
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
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/school`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data, "DATA");

          setSchool(data || null);
          setLoading(false);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching the student"
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId]);

  return (
    <div className="h-full w-full px-10 pb-16">
      <div className="space-y-0.5 py-8">
        <h1 className="text-2xl font-bold tracking-tight">School</h1>
        <p className="text-muted-foreground">Informations.</p>
      <Separator />
      </div>
      <div className="flex flex-col items-center justify-center  gap-6 mt-10">
        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p className="h-full w-full flex items-center justify-center">Loading...</p>
        ) : (
          <>
            {school ? (
              <Card className="sm:w-full md:w-5/12 mt-10 flex flex-col justify-center items-center relative p-6">
                <div className="flex sm:flex-col md:flex-row p-3 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                  <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                    {`Establishment name :`}
                  </CardContent>
                  <CardContent className="h-8  p-0 overflow-x-scroll">
                    {`${school.name}`}
                  </CardContent>
                </div>
                <div className="flex sm:flex-col md:flex-row p-3 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                  <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                    {`Address :`}
                  </CardContent>
                  <CardContent className="h-8  p-0 overflow-x-scroll">
                    {`${school.address}`}
                  </CardContent>
                </div>
                <div className="flex sm:flex-col md:flex-row p-3 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                  <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                    {`Zipcode :`}
                  </CardContent>
                  <CardContent className="h-8  p-0 overflow-x-scroll">
                    {`${school.zipcode}`}
                  </CardContent>
                </div>
                <div className="flex sm:flex-col md:flex-row p-3 md:w-10/12 sm:items-center  md:text-left  sm:text-center">
                  <CardContent className="h-8 p-0 md:w-6/12 md:pl-14">
                    {`City :`}
                  </CardContent>
                  <CardContent className="h-8  p-0 overflow-x-scroll">
                    {`${school.city}`}
                  </CardContent>
                </div>
                <Link
                  className="absolute right-0 bottom-0 p-3"
                  href={`/school-dashboard/settings/profil/update`}
                >
                  <button>Update</button>
                </Link>
              </Card>
            ) : (
              <p className="h-full w-full flex items-center justify-center">No student found with this ID.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
