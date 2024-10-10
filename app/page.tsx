"use client";

// next
import Link from "next/link";

// react
import { JSX } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";
// components
import { LogoIcon } from "@/components/icons/logo";
import { SchoolIcon } from "@/components/icons/SchoolIcon";
import { TeacherIcon } from "@/components/icons/TeacherIcon";
import { StudentIcon } from "@/components/icons/StudentIcon";
import { Button } from "@/components/ui/button";

interface ProfileType {
  name: string;
  icon: (props: IconProps) => JSX.Element;
  href: string;
}

interface ProfileProps {
  profiles: ProfileType[];
}

export default function Home() {
  const profiles: ProfileType[] = [
    {
      name: "School",
      icon: (props) => <SchoolIcon {...props} />,
      href: "/school-login",
    },
    {
      name: "Teacher",
      icon: (props) => <TeacherIcon {...props} />,
      href: "/teacher-login",
    },
    {
      name: "Student",
      icon: (props) => <StudentIcon {...props} />,
      href: "/student-login",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4 md:p-36">
        <LogoIcon size={200} />
        {profiles.map((profile, index) => (
          <Button
            key={index}
            className="bg-purple text-seasame w-40"
            variant="outline"
          >
            <Link href={profile.href} className="flex">
              <profile.icon className="w-5 mr-2" />
              {profile.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
