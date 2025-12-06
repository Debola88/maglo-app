/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChartAreaInteractive } from "@/views/dashboard/_component/chart-area-interactive";
import { DataTable } from "@/views/dashboard/_component/data-table";
import SectionCard from "@/views/dashboard/_component/section-cards";
import { IoWallet } from "react-icons/io5";
import { GiWallet } from "react-icons/gi";
import { MdWallet } from "react-icons/md";
import React, { useState, useEffect, useMemo } from "react";

interface Invoice {
  id: number;
  amount: number;
  status: "Paid" | "Pending";
  date: string;
  vat?: number;
  [key: string]: any;
}

interface Stats {
  totalInvoice: number;
  amountPaid: number;
  pendingPayment: number;
  totalVAT: number;
}

export default function DashboardView() {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = useMemo<Stats>(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        totalInvoice: 5240.21,
        amountPaid: 250.80,
        pendingPayment: 550.25,
        totalVAT: 391.52,
      };
    }

    const hasAmountField = 'amount' in data[0];
    if (!hasAmountField) {
      return {
        totalInvoice: 5240.21,
        amountPaid: 250.80,
        pendingPayment: 550.25,
        totalVAT: 391.52,
      };
    }

    const total = data.reduce((sum: number, invoice) => sum + (invoice.amount || 0), 0);
    const paid = data
      .filter((invoice) => invoice.status === "Paid")
      .reduce((sum: number, invoice) => sum + (invoice.amount || 0), 0);
    const pending = data
      .filter((invoice) => invoice.status === "Pending")
      .reduce((sum: number, invoice) => sum + (invoice.amount || 0), 0);
    const vat = data.reduce((sum: number, invoice) => sum + ((invoice.amount || 0) * 0.075), 0);

    return {
      totalInvoice: total,
      amountPaid: paid,
      pendingPayment: pending,
      totalVAT: vat,
    };
  }, [data]);

  const getData = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch("/api/data");
      const fetchedData = await res.json();
      
      if (fetchedData && Array.isArray(fetchedData)) {
        setData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([
        { id: 1, amount: 1500, status: "Paid", date: "2024-04-01" },
        { id: 2, amount: 2200, status: "Pending", date: "2024-04-02" },
        { id: 3, amount: 1800, status: "Paid", date: "2024-04-03" },
        { id: 4, amount: 3200, status: "Paid", date: "2024-04-04" },
        { id: 5, amount: 2700, status: "Pending", date: "2024-04-05" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const cardInfo = [
    {
      title: "Total Invoice",
      figure: stats.totalInvoice,
      icon: <IoWallet />,
      iconColor: "bg-[#4E5257] text-[#C8EE44]",
      bgColor: "bg-[#363A3F]",
      textColor: "text-white",
      formatFigure: (value: number | string) => Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      title: "Amount Paid",
      figure: stats.amountPaid,
      icon: <GiWallet />,
      formatFigure: (value: number | string) => Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      title: "Pending Payment",
      figure: stats.pendingPayment,
      icon: <MdWallet />,
      formatFigure: (value: number | string) => Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      title: "Total VAT",
      figure: stats.totalVAT,
      icon: <MdWallet />,
      formatFigure: (value: number | string) => Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
      <div className="mt-6">
        <DataTable data={data} />
      </div>
    </React.Fragment>
  );
}