import { useCallback } from "react";
import { Student } from "@/components/ClassWithSignatures/StudentList";

export function useFetchStudents(
  classId: number | null,
  setStudents: (students: Student[]) => void,
  setError: (error: string | null) => void,
) {
  const fetchStudents = useCallback(async () => {
    if (classId) {
      try {
        const res = await fetch(`/api/student?classid=${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();

          setStudents(data.users || []);
        } else {
          throw new Error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Request Error:", error);
        setError("Failed to fetch students");
      }
    } else {
      setError(null);
    }
  }, [classId, setStudents, setError]);

  return { fetchStudents };
}
