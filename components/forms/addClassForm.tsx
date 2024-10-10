"use client";

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import { classSchema } from "@/lib/schemas/classSchema";

// UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


export default function AddClassForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = classSchema.safeParse({ name });

    if (!result.success) {
      setError(
        "Invalid input: " +
          result.error.errors.map((e) => e.message).join(", "),
      );
      return;
    }
    setError(null);

    try {
      const res = await fetch("/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
        credentials: "include",
      });

      if (res.ok) {
        toast({
          className: "bg-green-400",
          description: "New class added",
          duration: 2000,
        });
        router.back();
      } else {
        toast({
          title: "An error occurred while adding the class",
          description: "Please try again later",
          duration: 2000,
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-center">Please add required informations</CardTitle>

      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end items-center pt-6">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
