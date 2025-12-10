"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InvoiceSubmissionData {
  clientName: string;
  clientEmail: string;
  amount: number;
  vat: number;
  vatAmount: number;
  total: number;
  dueDate: string;
  status: "Paid" | "Unpaid";
}

interface Invoice {
  $id?: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  vat: number;
  vatAmount: number;
  total: number;
  dueDate: string | Date;
  status: "Paid" | "Unpaid";
}

interface CreateInvoiceFormProps {
  onSubmit: (values: InvoiceSubmissionData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Invoice;
}

export function CreateInvoiceForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: CreateInvoiceFormProps) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        clientName: initialData.clientName,
        clientEmail: initialData.clientEmail,
        amount: initialData.amount.toString(),
        vat: initialData.vat.toString(),
        dueDate: new Date(initialData.dueDate),
        status: initialData.status,
      };
    }
    return {
      clientName: "",
      clientEmail: "",
      amount: "",
      vat: "7.5",
      dueDate: undefined as Date | undefined,
      status: "Unpaid" as "Paid" | "Unpaid",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const amountValue = parseFloat(formData.amount) || 0;
  const vatPercentage = parseFloat(formData.vat) || 0;
  const vatAmount = amountValue * (vatPercentage / 100);
  const total = amountValue + vatAmount;

  const handleChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = "Client name must be at least 2 characters";
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Please enter a valid email address";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData: InvoiceSubmissionData = {
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      amount: amountValue,
      vat: vatPercentage,
      vatAmount: vatAmount,
      total: total,
      dueDate: formData.dueDate!.toISOString().split("T")[0],
      status: formData.status,
    };

    onSubmit(submissionData);
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientName" className="text-sm font-medium">
            Client Name
          </Label>
          <Input
            id="clientName"
            placeholder="Enter client name"
            value={formData.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
            className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#C8EE44]"
            disabled={isLoading}
          />
          {errors.clientName && (
            <p className="text-sm text-red-500">{errors.clientName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail" className="text-sm font-medium">
            Client Email
          </Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="Enter client email"
            value={formData.clientEmail}
            onChange={(e) => handleChange("clientEmail", e.target.value)}
            className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#C8EE44]"
            disabled={isLoading}
          />
          {errors.clientEmail && (
            <p className="text-sm text-red-500">{errors.clientEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount (₦)
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#C8EE44]"
            disabled={isLoading}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vat" className="text-sm font-medium">
            VAT (%)
          </Label>
          <Input
            id="vat"
            type="number"
            placeholder="7.5"
            step="0.1"
            min="0"
            max="100"
            value={formData.vat}
            onChange={(e) => handleChange("vat", e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#C8EE44]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dueDate"
                variant="outline"
                className={cn(
                  "w-full bg-[#F8F8F8] border-none justify-start text-left font-normal hover:bg-[#F8F8F8] focus:ring-1 focus:ring-[#C8EE44]",
                  !formData.dueDate && "text-muted-foreground"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? (
                  format(formData.dueDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => handleChange("dueDate", date!)}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: "Paid" | "Unpaid") =>
              handleChange("status", value)
            }
            disabled={isLoading}
          >
            <SelectTrigger
              id="status"
              className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#C8EE44]"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[#F8F8F8] p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium">
            ₦
            {amountValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            VAT ({vatPercentage.toFixed(1)}%):
          </span>
          <span className="text-muted-foreground">
            ₦
            {vatAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between pt-2 border-t">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg">
            ₦
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-[#C8EE44] text-[#1B212D] hover:bg-[#b8de3c]"
          disabled={isLoading}
        >
          {isLoading 
            ? (isEditMode ? "Updating..." : "Creating...") 
            : (isEditMode ? "Update Invoice" : "Create Invoice")
          }
        </Button>
      </div>
    </form>
  );
}