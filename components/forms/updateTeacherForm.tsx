"use client";

// react
import { useState, useEffect } from "react";

// next
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

// ui
import { Card, CardContent, CardHeader,CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function UpdateTeacherForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ id: string }>() || null;

  const id = params?.id || null;
  console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/teacher?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setFirstname(data.user?.firstname || "");
          setLastname(data.user?.lastname || "");
          setEmail(data.user?.email || "");
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching the student"
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError("Invalid request. Missing student ID.");
      return;
    }

    try {
      const res = await fetch(`/api/teacher?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
        }),
        credentials: "include",
      });

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "Teacher updated successfully",
          duration: 2000,
        });
        router.back();
      } else {
        const errorData = await res.json();

        if (errorData.error) {
          setError(errorData.error);
        } else if (res.status === 409) {
          setError("The email is already associated with another student.");
        } else if (res.status === 400) {
          setError("Invalid input data. Please check the form fields.");
        } else {
          setError("An error occurred while updating the student.");
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
        <CardTitle className="text-center">
          Update form
        </CardTitle>
        <CardDescription className="text-center">
          Please fill out the form to update teacher&apos;s informations.
        </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate}>
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
