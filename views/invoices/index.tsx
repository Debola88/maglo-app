/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { SearchIcon, Filter } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import buttonIcon from "@/assets/image/Vector.svg";
import { DataTable } from "./_components/data-table";
import { columns, Invoice } from "./_components/table-columns";
import { ColumnFiltersState } from "@tanstack/react-table";
import { CreateInvoiceForm } from "./_components/create-invoice-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { invoiceService } from "@/lib/services/invoice.service";
import { useAuth } from "@/context/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DashboardInvoiceView() {
  const { user } = useAuth();
  const [data, setData] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  useEffect(() => {
    const filters: ColumnFiltersState = [];

    if (searchQuery) {
      filters.push({ id: "clientName", value: searchQuery });
    }

    if (statusFilter !== "all") {
      filters.push({
        id: "status",
        value: statusFilter === "paid" ? "Paid" : "Unpaid",
      });
    }

    setColumnFilters(filters);
  }, [searchQuery, statusFilter]);

  const fetchInvoices = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: invoices, error } = await invoiceService.getUserInvoices(
        user.$id
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (invoices) {
        setData(invoices as any);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setIsFilterOpen(false);
  };

  const handleCreateInvoice = async (values: any) => {
    if (!user) {
      toast.error("You must be logged in to create invoices");
      return;
    }

    setIsCreating(true);
    try {
      const invoiceData = {
        ...values,
        userId: user.$id,
      };

      const { data: newInvoice, error } = await invoiceService.createInvoice(
        invoiceData
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (newInvoice) {
        setData([newInvoice as any, ...data]);
        setIsDialogOpen(false);
        toast.success(`Invoice created successfully!`);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleUpdateInvoice = async (values: any) => {
    if (!editingInvoice) return;

    setIsUpdating(true);
    try {
      const { data: updatedInvoice, error } =
        await invoiceService.updateInvoice(editingInvoice.$id, values);

      if (error) {
        toast.error(error);
        return;
      }

      if (updatedInvoice) {
        setData(
          data.map((inv) =>
            inv.$id === editingInvoice.$id ? (updatedInvoice as any) : inv
          )
        );
        setIsEditDialogOpen(false);
        setEditingInvoice(null);
        toast.success("Invoice updated successfully!");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setDeletingInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInvoice) return;

    setIsDeleting(true);
    try {
      const { error } = await invoiceService.deleteInvoice(deletingInvoice.$id);

      if (error) {
        toast.error(error);
        return;
      }

      setData(data.filter((inv) => inv.$id !== deletingInvoice.$id));
      setIsDeleteDialogOpen(false);
      setDeletingInvoice(null);
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading invoices...</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="flex justify-between px-4 lg:px-6 mb-4">
        <InputGroup className="rounded-lg max-w-max bg-[#F8F8F8]">
          <InputGroupInput
            placeholder="Search invoices"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C8EE44] text-[#1B212D] p-4 text-sm hover:bg-[#b8de3c]">
                <Image
                  src={buttonIcon}
                  alt=""
                  width={16}
                  height={16}
                  className="mr-2"
                />
                Create Invoice
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
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {statusFilter !== "all" && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusFilter === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {statusFilter === "paid" ? "Paid" : "Unpaid"}
                  </span>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Invoice
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the invoice details below.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {editingInvoice && (
              <CreateInvoiceForm
                initialData={editingInvoice}
                onSubmit={handleUpdateInvoice}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingInvoice(null);
                }}
                isLoading={isUpdating}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invoice for{" "}
              <span className="font-semibold">
                {deletingInvoice?.clientName}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataTable
        data={data}
        columns={columns}
        columnFilters={columnFilters}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteClick}
      />
    </React.Fragment>
  );
}
