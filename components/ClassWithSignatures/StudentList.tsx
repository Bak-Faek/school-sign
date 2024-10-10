import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export interface Student {
  id: string;
  class: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  signature?: string;
}

export interface Signature {
  id: number;
  hashedSign: string;
  lessonId?: number;
  userId?: string;
  date?: string;
}

interface StudentListProps {
  students: Student[];
  signatures: Signature[];
  currentLessonId: number;
  error?: string | null;
}

export default function StudentList({
  students,
  signatures,
  currentLessonId,
  error,
}: StudentListProps) {
  const findSignatureForStudent = (studentId: string) => {
    const signature = signatures.find(
      (sig) => sig.userId === studentId && sig.lessonId === currentLessonId
    );
    return signature ? signature.hashedSign : null;
  };

  return (
    <>
      {students?.length ? (
        <ul className="flex justify-center gap-6 my-10 flex-wrap w-full">
          {students
            .filter((student) => student.role === "STUDENT")
            .map((student) => {
              const studentSignature = findSignatureForStudent(student.id);
              return (
                <li
                  key={student.id}
                  className="min-h-20 mx-10 sm:w-full md:w-72"
                >
                  <Card className="flex flex-col justify-center items-center h-56 ">
                    <CardHeader>
                      <CardTitle className="text-center">
                        {`Firstname : ${student.firstname} `}
                      </CardTitle>
                      <CardTitle className="text-center">
                        {`Lastname : ${student.lastname}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <p>Signature :</p>
                      {studentSignature ? (
                        <Image
                          src={studentSignature || "/default-signature.png"}
                          alt={`Signature of ${student.firstname} ${student.lastname}`}
                          width={160}
                          height={100}
                          priority
                        />
                      ) : (
                        <p className=" h-20 min-h-20 w-40 min-w-36 text-center text-red-500 font-light">
                          No signature received.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
        </ul>
      ) : (
        <p>No students were found for this class.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
