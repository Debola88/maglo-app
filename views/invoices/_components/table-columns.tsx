"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

export type Invoice = {
  $id: string;
  id?: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  vat: number; 
  vatAmount: number;
  total: number;
  dueDate: string | Date;
  status: "Paid" | "Unpaid";
  createdAt?: string | Date;
};

interface ColumnMeta {
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "clientName",
    header: "Client Name",
    filterFn: (row, id, value) => {
      const clientName = row.getValue(id) as string;
      const clientEmail = row.original.clientEmail || "";
      const searchValue = value.toLowerCase();
      return (
        clientName.toLowerCase().includes(searchValue) ||
        clientEmail.toLowerCase().includes(searchValue)
      );
    },
    cell: ({ row }) => {
      const clientName = row.original.clientName || "Unknown";
      const clientEmail = row.original.clientEmail || "";
      
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {clientName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{clientName}</div>
            {clientEmail && (
              <div className="text-sm text-muted-foreground">
                {clientEmail}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount (₦)",
    cell: ({ row }) => {
      const amount = row.original.amount || 0;
      return (
        <div className="font-medium">
          ₦{amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "vat",
    header: "VAT (%)",
    cell: ({ row }) => {
      const vat = row.original.vat || 0;
      return <div>{vat}%</div>;
    },
  },
  {
    accessorKey: "vatAmount",
    header: "VAT Amount (₦)",
    cell: ({ row }) => {
      const vatAmount = row.original.vatAmount || 0;
      return (
        <div className="text-muted-foreground">
          ₦{vatAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total (₦)",
    cell: ({ row }) => {
      const total = row.original.total || 0;
      return (
        <div className="font-semibold">
          ₦{total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      if (!dueDate) return <div>-</div>;
      
      const date = new Date(dueDate);
      return (
        <div>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === "Paid"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as ColumnMeta | undefined;
      
      return (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2" align="end">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => meta?.onEdit?.(row.original)}
                  className="w-full justify-start text-sm font-normal hover:bg-gray-100"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => meta?.onDelete?.(row.original)}
                  className="w-full justify-start text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];