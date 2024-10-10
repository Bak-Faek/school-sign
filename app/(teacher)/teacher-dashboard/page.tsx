"use client";

// react
import { useEffect, useState } from "react";
// hooks
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { useFetchClassDetails } from "@/hooks/useFetchClassDetails";
import { useFetchSignatures } from "@/hooks/useFetchSignatures";

// tanstack
import { DataTable } from "@/components/table/data-table";
import { ClassCol, columns, StatusType } from "@/components/table/columns";
import {
  Signature,
  Student,
} from "@/components/ClassWithSignatures/StudentList";
import { useSignatureContext } from "@/components/context/SignatureContext";
import {
  SchoolDetails,
  useFetchSchoolDetails,
} from "@/hooks/useFetchSchoolDetails";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function TeacherDashboard() {
  const [data, setData] = useState<ClassCol[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);

  const { allowSignature, disallowSignature, isSignatureAllowed } =
    useSignatureContext();
  const { toast } = useToast();

  const { fetchClassId, fetchClassName } = useFetchClassDetails(
    setTeacherName,
    setClassId,
    setClassName,
    classId,
  );
  const { fetchStudents } = useFetchStudents(classId, setStudents, setError);
  const { fetchSchoolDetails } = useFetchSchoolDetails(setSchoolDetails);
  const { fetchSignatures } = useFetchSignatures(setSignatures, setError);

  useEffect(() => {
    fetchClassId();
  }, [fetchClassId]);

  useEffect(() => {
    if (classId) {
      fetchStudents();
      fetchClassName();
      fetchSignatures();
    }
  }, [classId, fetchStudents, fetchClassName, fetchSignatures]);

  useEffect(() => {
    fetchSchoolDetails();
  }, [fetchSchoolDetails]);

  useEffect(() => {
    if (students.length > 0 && className !== null) {
      // Filter out students that are not students
      const filteredStudents = students.filter(
        (student) => student.role === "STUDENT",
      );

      // Map over the filtered students and get the signature status
      const combinedData = filteredStudents.map((student) => {
        const studentSignature = signatures.find(
          (signature) => signature.userId === student.id,
        );

        // Set the signature status to pending if the student has no signature
        let signatureStatus: StatusType = "pending";
        if (studentSignature) {
          signatureStatus =
            (studentSignature.status as StatusType) || "received";
        }
        console.log(className);

        return {
          id: student.id.toString(),
          class: className || "",
          lastname: student.lastname,
          firstname: student.firstname,
          email: student.email,
          signature: signatureStatus,
        };
      });

      // Set the data with the combined results
      setData(combinedData);
    }
  }, [students, signatures, className]);

  return (
    <div className="space-y-6 px-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Separator />
      <div className="py-10 flex flex-col justify-center">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
