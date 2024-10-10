"use client";

// react
import { useState, useEffect } from "react";

// next
import { useRouter } from "next/navigation";

// ui
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// zod
import { z } from "zod";
import { registerSchemaSchool } from "@/lib/schemas/registerSchemaSchool";
import { useToast } from "@/hooks/use-toast";
import { log } from "node:console";

export default function UpdateSchoolForm() {
  const [schoolId, setSchoolId] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof registerSchemaSchool>, string>>
  >({});

  console.log(schoolId);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchoolId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();
          console.log(data);

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
        const res = await fetch(`/api/school?id=${schoolId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data, "SCHOOL DATA");

          setName(data.school?.name || "");
          setAddress(data.school?.address || "");
          setZipcode(data.school?.zipcode || "");
          setCity(data.school?.city || "");
        } else {
          const errorData = await res.json();
          setErrors(
            errorData.error || "An error occurred while fetching the school"
          );
        }
      } catch (err) {
        console.error("Request Error:", err);
      }
    };

    if (schoolId) {
      fetchData();
    }
  }, [schoolId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const response = await fetch(`/api/school?id=${schoolId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, address, zipcode, city }),
    });

    if (response.ok) {
      toast({
        title: "Modification Successful",
        className: "bg-green-400",
        duration: 2000,
      });
      router.back();
    } else {
      toast({
        className: "bg-red-700 text-white",
        description: "Please enter correct informations",
        duration: 2000,
      });
    }
  };
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-center">
          Update form
        </CardTitle>
        <CardDescription className="text-center">
        Please fill out the form to update school&apos;s informations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Establishment name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Victor Schoelcher"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="273 rue Victor Schoelcher"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipcode">Zipcode</Label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  placeholder="69009"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Lyon"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-end mt-5 pb-0">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
