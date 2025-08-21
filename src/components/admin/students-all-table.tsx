
"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Student } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'

const getVisaStatusBadgeVariant = (status?: Student['visaStatus']) => {
  switch (status) {
    case 'Approved': return 'default';
    case 'Pending': return 'secondary';
    case 'Rejected': return 'destructive';
    default: return 'outline';
  }
};

const getFeeStatusBadgeVariant = (status?: Student['serviceFeeStatus']) => {
  switch (status) {
      case 'Paid': return 'default';
      case 'Unpaid': return 'outline';
      default: return 'outline';
  }
};

const formatDate = (date: Date | undefined | null) => {
    return date ? format(date, "dd MMM yyyy") : 'N/A';
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "fullName",
    header: "Student",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("fullName")}</div>
        <div className="text-muted-foreground text-xs">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "mobileNumber",
    header: "Phone",
  },
  {
    accessorKey: "preferredStudyDestination",
    header: "Destination",
  },
  {
    accessorKey: "visaStatus",
    header: "Visa Status",
    cell: ({ row }) => {
      const status = row.getValue("visaStatus") as Student['visaStatus'];
      return <Badge variant={getVisaStatusBadgeVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "visaStatusUpdateDate",
    header: "Visa Date",
    cell: ({ row }) => formatDate(row.getValue("visaStatusUpdateDate")),
  },
  {
    accessorKey: "serviceFeeStatus",
    header: "Fee Status",
    cell: ({ row }) => {
      const status = row.getValue("serviceFeeStatus") as Student['serviceFeeStatus'];
      return <Badge variant={getFeeStatusBadgeVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "serviceFeePaidDate",
    header: "Fee Date",
    cell: ({ row }) => formatDate(row.getValue("serviceFeePaidDate")),
  },
  {
    accessorKey: "assignedTo",
    header: "Counselor",
  },
  {
    accessorKey: "lastCompletedEducation",
    header: "Education",
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
    cell: ({ row }) => formatDate(row.getValue("timestamp")),
  },
];

interface DataTableProps {
  data: Student[];
}

export function StudentsAllTable({ data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, // Sorting is handled by Firestore query
  })

  return (
    <div className="rounded-md border">
      <Table className="text-xs">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-2 h-10">
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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found for the selected filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
