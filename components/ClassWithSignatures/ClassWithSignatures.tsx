"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ClassComponent from "./ClassComponent";
import StudentList, { Student, Signature } from "./StudentList";
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { useFetchLessons } from "@/hooks/useFetchLesson";
import {
  SchoolDetails,
  useFetchSchoolDetails,
} from "@/hooks/useFetchSchoolDetails";
import { useFetchClassDetails } from "@/hooks/useFetchClassDetails";
import { useFetchSignatures } from "@/hooks/useFetchSignatures";
import PDFGenerator from "./PDFGenerator";
import { Lesson } from "../calendar/CalendarTest";
import SignatureActions from "./SignatureActions";
import { useSignatureContext } from "../context/SignatureContext";
import React from "react";

export default function ClassWithSignatures() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const { allowSignature, disallowSignature, isSignatureAllowed } =
    useSignatureContext();

  // Fetch hooks
  const { fetchClassId, fetchClassName } = useFetchClassDetails(
    setTeacherName,
    setClassId,
    setClassName,
    classId,
  );
  const { fetchStudents } = useFetchStudents(classId, setStudents, setError);
  const { fetchSchoolDetails } = useFetchSchoolDetails(setSchoolDetails);
  const { fetchSignatures } = useFetchSignatures(setSignatures, setError);
  const { fetchLessons } = useFetchLessons(classId, setLessons, setError);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchClassId();
      } catch (err) {
        setError("Failed to fetch class information.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchClassId]);

  // Fetch students, class name, signatures, and lessons when classId is available
  useEffect(() => {
    if (classId) {
      Promise.all([
        fetchStudents(),
        fetchClassName(),
        fetchSignatures(),
        fetchLessons(),
      ]).catch((err) => setError("Failed to fetch necessary data."));
    }
  }, [classId, fetchStudents, fetchClassName, fetchSignatures, fetchLessons]);
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        await fetchSchoolDetails();
      } catch (err) {
        setError("Failed to fetch school details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [fetchSchoolDetails]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const isLessonOngoing = (dateStart: Date, dateEnd: Date): boolean => {
    return currentDateTime >= dateStart && currentDateTime <= dateEnd;
  };

  const handleGeneratePDF = async () => {
    const currentLesson = lessons.find((lesson) =>
      isLessonOngoing(new Date(lesson.dateStart), new Date(lesson.dateEnd)),
    );

    if (!currentLesson) {
      toast({
        title: "Erreur",
        description: "Aucune leçon en cours trouvée.",
        className: "bg-red-500",
        duration: 2000,
      });
      return;
    }

    const currentLessonId = currentLesson.id;
    const studentSignatures = students.map((student) => {
      const studentSignature = signatures.find(
        (sig) => sig.userId === student.id && sig.lessonId === currentLessonId,
      );

      return {
        userId: student.id,
        hashedSign: studentSignature ? studentSignature.hashedSign : "",
      };
    });

    if (students.length === 0 || !schoolDetails || !className || !teacherName) {
      toast({
        title: "Error",
        description: "Missing required data to generate PDF.",
        className: "bg-red-500",
        duration: 2000,
      });
      return;
    }

    try {
      await PDFGenerator({
        students,
        signatures: studentSignatures,
        schoolDetails,
        className,
        teacherName,
        lessonName: currentLesson.name,
        startDate: new Date(currentLesson.dateStart),
        endDate: new Date(currentLesson.dateEnd),
        toast,
      });
      toast({
        title: "PDF generated successfully!",
        className: "bg-green-400",
        duration: 2000,
      });
    } catch (error: unknown) {
      console.error("Error generating PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Failed to generate PDF.",
        description: errorMessage,
        className: "bg-red-500",
        duration: 2000,
      });
    }
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (loading) return <p className="h-full w-full flex items-center justify-center">Loading...</p>;

  return (
    <>
      {classId ? (
        <div className="flex flex-col items-center pb-20">
          {lessons.length > 0 ? (
            lessons.map((lesson) => {
              const startDate = new Date(lesson.dateStart);
              const endDate = new Date(lesson.dateEnd);
              const lessonIsOngoing = isLessonOngoing(startDate, endDate);

              return lessonIsOngoing ? (
                <div key={lesson.id} className="flex flex-col items-center">
                  <ClassComponent
                    className={className}
                    lessonName={lesson.name}
                    startHour={formatTime(startDate)}
                    endHour={formatTime(endDate)}
                    classId={classId}
                  />
                  <SignatureActions
                    classId={classId}
                    isSignatureAllowed={isSignatureAllowed}
                    allowSignature={allowSignature}
                    disallowSignature={disallowSignature}
                    toast={toast}
                  />
                  <StudentList
                    students={students}
                    signatures={signatures}
                    currentLessonId={lesson.id}
                    error={error}
                  />
                  <Button
                    onClick={handleGeneratePDF}
                    disabled={students.length === 0}
                  >
                    Generate PDF
                  </Button>
                </div>
              ) : null;
            })
          ) : (
            <p className="h-full w-full flex items-center justify-center">No ongoing lesson.</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ) : (
        <p className="h-full w-full flex items-center justify-center">No class found.</p>
      )}
    </>
  );
}
