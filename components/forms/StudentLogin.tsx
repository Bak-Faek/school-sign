"use client";

// react
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/loginSchema";

// next
import Link from "next/link";

// ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      toast({
        title: "Error",
        description: errorMessage,
        duration: 2000,
      });
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      toast({
        className: "bg-green-400",
        description: "Welcome back!",
        duration: 2000,
      });
      router.push("/student-dashboard");
    } else {
      toast({
        className: "bg-red-700 text-white",
        description: "Invalid email or password.",
        duration: 2000,
      });
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-center">Student login</CardTitle>
        <CardDescription className="text-center">
          Enter your login details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
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
            <div className="mt-4 text-center text-sm">
              New here?
              <Button variant="link" asChild>
                <Link href="/school-register" className="underline">
                  Click here to register
                </Link>
              </Button>
            </div>
          </div>
          <CardFooter className="flex justify-end">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
