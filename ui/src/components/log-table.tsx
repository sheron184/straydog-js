import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useRef } from "react";
import { useRequest } from "@/hooks/use-request";

export default function ErrorLogTable<TData, TValue>({
  columns,
  days
}: { columns: ColumnDef<TData, TValue>[], days: string }) {
  const { data, loading, get } = useRequest();
  const previousDataRef = useRef<TData[]>([]);

  useEffect(() => {
    get({ method: 'getErrorRequests', days: days });
    const interval = setInterval(() => get({ method: 'getErrorRequests', days: 1 }), 3000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  // Stabilize data reference to prevent unnecessary re-renders
  const stableData = useMemo(() => {
    if (!data) return previousDataRef.current;

    // Deep compare or use your preferred comparison logic
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);

    if (hasChanged) {
      previousDataRef.current = data;
      return data;
    }

    return previousDataRef.current;
  }, [data]);

  const table = useReactTable({
    data: stableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Add this to prevent flashing
    enableRowSelection: false,
  });

  if (loading && !previousDataRef.current.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border w-full">
      <Table>
        <TableHeader className="bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className="bg-red-500 opacity-[0.8] text-white hover:bg-red-700 transition-colors duration-200"
                data-state={row.getIsSelected() && "selected"}
                // Add staggered animation for new rows
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 bg-gray-800">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}