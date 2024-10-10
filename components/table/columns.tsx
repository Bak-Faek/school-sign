"use client";

// tanstack
import { ColumnDef } from "@tanstack/react-table";

// ui
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import {
  CheckCircledIcon,
  Cross2Icon,
  LapTimerIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";

// Define status types for better type safety
export type StatusType = "pending" | "processing" | "received" | "failed";

// Create a mapping of status types to their properties
export const statusConfig: Record<
  StatusType,
  { label: string; icon: React.ComponentType }
> = {
  pending: { label: "Pending", icon: LapTimerIcon },
  processing: { label: "Processing", icon: UpdateIcon },
  received: { label: "Received", icon: CheckCircledIcon },
  failed: { label: "Failed", icon: Cross2Icon },
};

// Generate statuses array from the config
export const statuses = Object.entries(statusConfig).map(
  ([value, { label, icon }]) => ({
    value,
    label,
    icon,
  }),
);

// Define ClassCol type with more specific types
export type ClassCol = {
  id: string;
  class: string;
  lastname: string;
  firstname: string;
  email: string;
  signature: StatusType;
};

export const columns: ColumnDef<ClassCol>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[0px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "class",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lastname" />
    ),
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Firstname" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "signature",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Signature" />
    ),
  },
];
