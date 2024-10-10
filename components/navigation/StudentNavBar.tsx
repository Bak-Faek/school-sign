"use client";

// components
import SideNav from "@/components/navigation/components/SideNav";
import BottomNav from "@/components/navigation/components/BottomNav";
import { NavLink } from "@/components/navigation/components/navTypes";
// ui
import {
  CalendarIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

export default function StudentNavBar() {
  const isMobile = useIsMobile();

  const links: NavLink[] = [
    {
      name: "Home",
      icon: (props) => <HomeIcon {...props} />,
      variant: "default",
      href: "/student-dashboard",
    },
    {
      name: "Schedule",
      icon: (props) => <CalendarIcon {...props} />,
      variant: "ghost",
      href: "/student-dashboard/schedule",
    },
    {
      name: "Documents",
      icon: (props) => <FileTextIcon {...props} />,
      variant: "ghost",
      href: "/student-dashboard/documents",
    },
    {
      name: "Settings",
      icon: (props) => <GearIcon {...props} />,
      variant: "ghost",
      href: "/student-dashboard/settings",
    },
  ];

  return (
    <>{isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}</>
  );
}
