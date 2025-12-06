/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// FILE 5: invoice-view.tsx (index.tsx) - WITH CREATE FORM DIALOG
// PATH: views/invoices/index.tsx
// ============================================
"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchIcon, Filter, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import buttonIcon from "@/assets/image/Vector.svg";
import { DataTable } from "./_components/data-table";
import { columns, Invoice } from "./_components/table-columns";
import { ColumnFiltersState } from "@tanstack/react-table";
import { CreateInvoiceForm } from "./_components/create-invoice-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const generateInvoiceId = (existingCount: number): string => {
  const nextNumber = 100000 + existingCount + 1;
  return `MGL${nextNumber.toString().slice(-6)}`;
};

export default function DashboardInvoiceView() {
  const [data, setData] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  });

  const getData = async (): Promise<void> => {
    try {
      const res = await fetch("/api/invoices");
      const fetchedData = await res.json();
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (value === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters([
        {
          id: "status",
          value: value === "paid" ? "Paid" : "Unpaid",
        },
      ]);
    }
    setIsFilterOpen(false);
  };

  const handleCreateInvoice = async (values: any) => {
    setIsCreating(true);
    try {
      const newId = generateInvoiceId(data.length);

      const newInvoice: Invoice = {
        id: newId,
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        amount: values.amount,
        vat: values.vat,
        vatAmount: values.vatAmount,
        total: values.total,
        dueDate: values.dueDate,
        status: values.status,
        createdAt: new Date(),
      };

      // Send to your API
      // const response = await fetch("/api/invoices", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newInvoice),
      // });
      // const result = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData([newInvoice, ...data]);

      setIsDialogOpen(false);

      toast.success(`Invoice ${newId} created successfully!`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-between px-4 lg:px-6 mb-4">
        <InputGroup className="rounded-lg max-w-max bg-[#F8F8F8]">
          <InputGroupInput placeholder="Search invoices" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#C8EE44] text-[#1B212D] p-4 text-sm hover:bg-[#b8de3c]"
                size={isMobile ? "icon" : "default"}
              >
                {isMobile ? (
                  <Plus className="h-4 w-4" />
                ) : (
                  <React.Fragment>
                    <Image
                      src={buttonIcon}
                      alt=""
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    Create Invoice
                  </React.Fragment>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Create New Invoice
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Fill in the details below to create a new invoice. All fields
                  are required.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <CreateInvoiceForm
                  onSubmit={handleCreateInvoice}
                  onCancel={() => setIsDialogOpen(false)}
                  isLoading={isCreating}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#F8F8F8] border-none hover:bg-gray-200"
                size={isMobile ? "icon" : "default"}
              >
                {isMobile ? (
                  <Filter className="h-4 w-4" />
                ) : (
                  <React.Fragment>
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {statusFilter !== "all" && (
                      <span className="ml-2 px-2 py-0.5 bg-[#C8EE44] text-[#1B212D] rounded-full text-xs font-medium">
                        {statusFilter === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    )}
                  </React.Fragment>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal",
                    statusFilter === "all" && "bg-[#C8EE44]/20 font-medium"
                  )}
                  onClick={() => handleStatusFilterChange("all")}
                >
                  All Invoices
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal",
                    statusFilter === "paid" && "bg-[#C8EE44]/20 font-medium"
                  )}
                  onClick={() => handleStatusFilterChange("paid")}
                >
                  Paid
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal",
                    statusFilter === "unpaid" && "bg-[#C8EE44]/20 font-medium"
                  )}
                  onClick={() => handleStatusFilterChange("unpaid")}
                >
                  Unpaid
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DataTable data={data} columns={columns} columnFilters={columnFilters} />
    </React.Fragment>
  );
}
