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
  PersonIcon,
} from "@radix-ui/react-icons";
// hooks
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

export default function TeacherNavBar() {
  const isMobile = useIsMobile();

  const links: NavLink[] = [
    {
      name: "Home",
      icon: (props) => <HomeIcon {...props} />,
      variant: "ghost",
      href: "/teacher-dashboard",
    },
    {
      name: "Schedule",
      icon: (props) => <CalendarIcon {...props} />,
      variant: "ghost",
      href: "/teacher-dashboard/schedule",
    },
    {
      name: "Class",
      icon: (props) => <PersonIcon {...props} />,
      variant: "ghost",
      href: "/teacher-dashboard/class",
    },
    {
      name: "Documents",
      icon: (props) => <FileTextIcon {...props} />,
      variant: "ghost",
      href: "/teacher-dashboard/documents",
    },
    {
      name: "Settings",
      icon: (props) => <GearIcon {...props} />,
      variant: "ghost",
      href: "/teacher-dashboard/settings",
    },
  ];

  return (
    <>{isMobile ? <BottomNav links={links} /> : <SideNav links={links} />}</>
  );
}
