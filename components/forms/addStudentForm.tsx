"use client";

// react
import { useState, useEffect } from "react";

// next
import { useRouter } from "next/navigation";
import { Student } from "@/app/(school)/school-dashboard/class/[name]/student/page";

// ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AddStudentForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const fetchAllTeachers = async () => {
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
            errorData.error || "An error occurred while fetching teachers",
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    fetchAllTeachers();
  }, []);

  const getClassId = () => {
    if (classData.length > 0) {
      const classSection = classData.find((cls) => cls.schoolId === userSchoolId);
      return classSection ? classSection.id : "Class not found";
    }
    return null;
  };

  const classId = getClassId();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          classId,
        }),
        credentials: "include",
      });
      console.log(res);

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "Student added",
          duration: 2000,
        });
        router.back();
      } else {
        // toast({
        //   className: "bg-red-500",
        //   description: "Email already in use",
        //   duration: 2000,
        // });
        const errorData = await res.json();
        console.log(errorData.details);

        if (errorData.error) {
          setError(errorData.error);
        } else if (res.status === 409) {
          setError("The email is already associated with another student.");
        } else if (res.status === 400) {
          setError("Invalid input data. Please check the form fields.");
        } else {
          setError("An error occurred while adding the student.");
        }
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96 mt-10">
        <CardHeader>
          <CardTitle className="text-center">Please add required informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="firstname">Firstname</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <Label htmlFor="lastname">Lastname</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="flex justify-end items-center pt-6">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
