"use client";

import { useEffect, useState } from "react";
import { useSignatureContext } from "@/components/context/SignatureContext";
import SignatureCanvas from "@/components/SignatureCanvas";
import { useFetchLessons } from "@/hooks/useFetchLesson";
import { Lesson } from "@/components/calendar/CalendarTest";
import { useFetchSignatures } from "@/hooks/useFetchSignatures";
import { Signature } from "@/components/ClassWithSignatures/StudentList";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function StudentDashboard() {
  const { isSignatureAllowed, currentClassId } = useSignatureContext();
  const [studentClassId, setStudentClassId] = useState<number | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchLessons } = useFetchLessons(
    studentClassId,
    setLessons,
    setError
  );
  const { fetchSignatures } = useFetchSignatures(setSignatures, setError);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  // Fetch the student class ID
  useEffect(() => {
    const fetchClassId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();
          setStudentClassId(data.user.classId);
          setStudentId(data.user.id); // Make sure this ID is a number
        } else {
          console.error("Erreur lors de la récupération du classId");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du classId", error);
      }
    };

    fetchClassId();
  }, []);

  // Fetch lessons and signatures once we have the studentClassId
  useEffect(() => {
    const fetchData = async () => {
      if (studentClassId) {
        try {
          await Promise.all([fetchSignatures(), fetchLessons()]);
        } catch (err) {
          setError("Failed to fetch class-related data.");
        }
      }
    };
    fetchData();
  }, [studentClassId, fetchSignatures, fetchLessons]);

  const canSign = isSignatureAllowed && currentClassId === studentClassId;

  // Update the current time every second
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isLessonOngoing = (dateStart: Date, dateEnd: Date): boolean => {
    return currentDateTime >= dateStart && currentDateTime <= dateEnd;
  };

  // Filter ongoing lessons
  const ongoingLessons = lessons.filter((lesson) => {
    const startDate = new Date(lesson.dateStart);
    const endDate = lesson.dateEnd ? new Date(lesson.dateEnd) : new Date(); // Default to now if endDate is not defined
    return isLessonOngoing(startDate, endDate);
  });

  const currentLessonId =
    ongoingLessons.length > 0 ? ongoingLessons[0].id : null;

  // Convert studentId to string for comparison
  const filteredSignatures = currentLessonId
    ? signatures.filter(
        (signature) =>
          signature.lessonId === currentLessonId &&
          signature.userId ===
            (studentId !== null ? studentId.toString() : undefined) // Convert studentId to string
      )
    : [];

  return (
    <div className="h-full w-full px-10 pb-16">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight pb-5">Dashboard</h1>
        <Separator />
      </div>
      <div className=" h-full flex flex-col items-center justify-center">
        {/* Render fetched signatures */}
        {filteredSignatures.length > 0 ? (
          <div className="mb-4">
            {filteredSignatures.map((signature) => (
              <div key={signature.id}>
                <div className="flex flex-col items-center">
                  <h4 className="mb-4">Saved Signature</h4>
                  <Image
                    src={signature.hashedSign}
                    alt="Signature"
                    width={600}
                    height={500}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : canSign && ongoingLessons.length > 0 ? (
          <SignatureCanvas lessonId={ongoingLessons[0].id} />
        ) : (
          <p className="text-gray-500">Aucune leçon en cours pour signer.</p>
        )}
      </div>
    </div>
  );
}
