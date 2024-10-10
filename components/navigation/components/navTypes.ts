// react
import { JSX } from "react";

// ui
import { IconProps } from "@radix-ui/react-icons/dist/types";

export interface NavLink {
  name: string;
  icon: (props: IconProps) => JSX.Element;
  variant: "default" | "ghost";
  href?: string | undefined;
}

export interface NavProps {
  links: NavLink[];
}
