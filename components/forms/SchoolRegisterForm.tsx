"use client";

// react
import { useState } from "react";

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

export default function SchoolRegisterForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof registerSchemaSchool>, string>>
  >({});

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchemaSchool.safeParse({
      name,
      address,
      zipcode,
      city,
      email,
      password,
    });

    if (!result.success) {
      const newErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as keyof typeof errors] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    const data = result.data;

    const response = await fetch("/api/registerSchool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast({
        title: "Registration Successful",
        className: "bg-green-400",
        duration: 2000,
      });
      router.push("/school-login");
    } else {
      const errorMessage = await response.text();
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
        <CardTitle className="text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Please fill out the form below to create an account.
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
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="VictorSchoelcher@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
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
