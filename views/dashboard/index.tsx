/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChartAreaInteractive } from "@/views/dashboard/_component/chart-area-interactive";
import { DataTable } from "@/views/dashboard/_component/data-table";
import SectionCard from "@/views/dashboard/_component/section-cards";
import { IoWallet } from "react-icons/io5";
import { GiWallet } from "react-icons/gi";
import { MdWallet } from "react-icons/md";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { invoiceService } from "@/lib/services/invoice.service";
import { toast } from "sonner";

interface Invoice {
  $id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  vat: number;
  vatAmount: number;
  total: number;
  dueDate: string | Date;
  status: "Paid" | "Unpaid";
  createdAt?: string | Date;
}

interface Stats {
  totalInvoice: number;
  amountPaid: number;
  pendingPayment: number;
  totalVAT: number;
}

export default function DashboardView() {
  const { user } = useAuth();
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate stats from real invoice data
  const stats = useMemo<Stats>(() => {
    if (!data || data.length === 0) {
      return {
        totalInvoice: 0,
        amountPaid: 0,
        pendingPayment: 0,
        totalVAT: 0,
      };
    }

    // Total of all invoices
    const totalInvoice = data.reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    // Sum of paid invoices
    const amountPaid = data
      .filter((invoice) => invoice.status === "Paid")
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    // Sum of unpaid invoices
    const pendingPayment = data
      .filter((invoice) => invoice.status === "Unpaid")
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    // Sum of VAT from paid invoices only
    const totalVAT = data
      .filter((invoice) => invoice.status === "Paid")
      .reduce((sum, invoice) => sum + (invoice.vatAmount || 0), 0);

    return {
      totalInvoice,
      amountPaid,
      pendingPayment,
      totalVAT,
    };
  }, [data]);

  // Fetch invoices from Appwrite
  const fetchInvoices = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const cardInfo = [
    {
      title: "Total Invoice",
      figure: stats.totalInvoice,
      icon: <IoWallet />,
      iconColor: "bg-[#4E5257] text-[#C8EE44]",
      bgColor: "bg-[#363A3F]",
      textColor: "text-white",
      formatFigure: (value: number | string) => 
        Number(value).toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }),
    },
    {
      title: "Amount Paid",
      figure: stats.amountPaid,
      icon: <GiWallet />,
      formatFigure: (value: number | string) => 
        Number(value).toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }),
    },
    {
      title: "Pending Payment",
      figure: stats.pendingPayment,
      icon: <MdWallet />,
      formatFigure: (value: number | string) => 
        Number(value).toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }),
    },
    {
      title: "Total VAT",
      figure: stats.totalVAT,
      icon: <MdWallet />,
      formatFigure: (value: number | string) => 
        Number(value).toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {cardInfo.map((card, index) => (
          <SectionCard
            key={index}
            title={card.title}
            figure={card.figure}
            icon={card.icon}
            iconColor={card.iconColor}
            bgColor={card.bgColor}
            textColor={card.textColor}
            formatFigure={card.formatFigure}
          />
        ))}
      </div>

      <div className="mt-6">
        <ChartAreaInteractive />
      </div>
      {/* <div className="mt-6">
        <DataTable data={data as any} />
      </div> */}
    </React.Fragment>
  );
}