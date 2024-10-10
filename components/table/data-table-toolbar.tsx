"use client";

// tanstack
import { Table } from "@tanstack/react-table";
import { statuses } from "@/components/table/columns";

// ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";

// import { DataTableViewOptions } from "@/app/(app)/examples/tasks/components/data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("signature") && (
          <DataTableFacetedFilter
            column={table.getColumn("signature")}
            title="Signature"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/*<DataTableViewOptions table={table} />*/}
    </div>
  );
}
