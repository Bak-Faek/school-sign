"use client";

// React imports
import { useState } from "react";

// UI component imports
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

// Zod validation import
import { z } from "zod";
import { registerSchemaSchool } from "@/lib/schemas/registerSchemaSchool";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState(""); // Use a string for zipcode
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Zod validation
    const result = registerSchemaSchool.safeParse({
      name,
      address,
      zipcode,
      city,
      email,
      password
    });

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      alert(errorMessage);
      return;
    }

    const data = result.data; // Use the validated data

    // API call with validated data
    const response = await fetch("/api/registerSchool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert("Registration successful!");
    } else {
      // More specific error handling based on response codes/messages
      const errorMessage = await response.text();
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96 mt-10 justify-center items-center">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Please fill in the form to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Establishment name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Victor Schoelcher"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="273 rue Victor Schoelcher"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input
                id="zipcode"
                name="zipcode"
                type="text" // Use type="text" for zipcode
                placeholder="69009"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Lyon"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
                            <Label htmlFor="email">email</Label>
              <Input
                id="email"
                name="email"
                type="email" // Use type="text" for email
                placeholder="VictorSchoelcher@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <CardFooter className="flex justify-end mt-5">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}