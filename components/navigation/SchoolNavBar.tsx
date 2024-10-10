"use client";

// components
import SideNav from "@/components/navigation/components/SideNav";
import BottomNav from "@/components/navigation/components/BottomNav";
import { NavLink } from "@/components/navigation/components/navTypes"; // ui
import {
  BackpackIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

export default function SchoolNavBar() {
  const isMobile = useIsMobile();

  const links: NavLink[] = [
    {
      name: "Home",
      icon: (props) => <HomeIcon {...props} />,
      variant: "default",
      href: "/school-dashboard",
    },
    {
      name: "Teacher",
      icon: (props) => <BackpackIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/teacher",
    },
    {
      name: "Class",
      icon: (props) => <PersonIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/class",
    },
    {
      name: "Documents",
      icon: (props) => <FileTextIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/documents",
    },
    {
      name: "Settings",
      icon: (props) => <GearIcon {...props} />,
      variant: "ghost",
      href: "/school-dashboard/settings",
    },
  ];

  return (
    <>{isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}</>
  );
}
