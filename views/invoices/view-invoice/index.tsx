// components/InvoiceView.tsx
"use client";

import React from "react";
import { format } from "date-fns";
import { Printer, X, Edit, Eye } from "lucide-react";

type InvoiceItem = {
  id: string;
  name: string;
  description?: string;
  orderType?: string; // e.g. "01"
  rate: number; // currency number
  quantity?: number; // default 1
  amount?: number; // optional precomputed
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  issuedAt: string | Date;
  dueDate: string | Date;
  from: {
    name: string;
    email?: string;
    addressLines?: string[];
  };
  to: {
    name: string;
    addressLines?: string[];
    email?: string;
  };
  items: InvoiceItem[];
  discount?: number;
  tax?: number; 
  notes?: string;
  status?: "Paid" | "Unpaid";
  createdAt?: string | Date;
};

interface InvoiceViewProps {
  invoice?: Invoice;
  onClose?: () => void;
  onEdit?: (invoice: Invoice) => void;
  onPrint?: (invoice: Invoice) => void;
}

export default function ViewInvoice({
  invoice = sampleInvoice,
  onClose,
  onEdit,
  onPrint,
}: InvoiceViewProps) {
  const computedItems = invoice.items.map((it) => {
    const qty = it.quantity ?? 1;
    const amount = it.amount ?? +(it.rate * qty);
    return { ...it, quantity: qty, amount };
  });

  const subtotal = computedItems.reduce((s, it) => s + (it.amount ?? 0), 0);
  const discount = invoice.discount ?? 0;
  const tax = invoice.tax ?? 0;
  const total = subtotal - discount + tax;

  const formatCurrency = (n = 0) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* top header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white">
          <div className="flex items-center gap-4">
            {/* logo circle */}
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-semibold text-xl">
              M
            </div>
            <div>
              <div className="text-lg font-semibold">Maglo</div>
              <div className="text-sm opacity-80">sales@maglo.com</div>
            </div>
          </div>

          <div className="text-sm text-right space-y-0.5">
            <div>1333 Grey Fox Farm Road</div>
            <div>Houston, TX 77060</div>
            <div>Bloomfield Hills, Michigan (MI), 48301</div>
          </div>
        </div>

        {/* main body */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* left/main column */}
          <div className="md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              {/* Invoice meta */}
              <div>
                <h3 className="text-xl font-semibold">Invoice Number</h3>
                <div className="mt-3 text-sm text-slate-700">
                  <div className="font-medium">{invoice.invoiceNumber}</div>
                  <div className="mt-2">Issued Date:{" "}
                    <span className="text-slate-600">
                      {format(new Date(invoice.issuedAt), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div>Due Date:{" "}
                    <span className="text-slate-600">
                      {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billed to */}
              <div className="text-right">
                <h4 className="text-lg font-semibold">Billed to</h4>
                <div className="mt-3 text-sm text-slate-700">
                  <div className="font-medium">{invoice.to.name}</div>
                  {invoice.to.addressLines?.map((l, i) => (
                    <div key={i} className="text-slate-600">{l}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Item details */}
            <div className="mt-8">
              <h4 className="text-md font-semibold">Item Details</h4>
              <p className="text-sm text-slate-500 mt-1">Details item with more info</p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b">
                      <th className="pb-3 text-left">ITEM</th>
                      <th className="pb-3 text-left">ORDER/TYPE</th>
                      <th className="pb-3 text-right">RATE</th>
                      <th className="pb-3 text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedItems.map((it) => (
                      <tr key={it.id} className="text-slate-700 border-b last:border-b-0">
                        <td className="py-4">
                          <div className="font-medium">{it.name}</div>
                          {it.description && <div className="text-xs text-slate-500">{it.description}</div>}
                        </td>
                        <td className="py-4">{it.orderType ?? "01"}</td>
                        <td className="py-4 text-right">{"$" + formatCurrency(it.rate)}</td>
                        <td className="py-4 text-right">{"$" + formatCurrency(it.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-green-600 text-sm font-medium">
                <button className="text-sm underline">Add Item</button>
              </div>

              {/* Summary (right aligned) */}
              <div className="mt-6 flex justify-end">
                <div className="w-full md:w-1/2 lg:w-1/3 bg-slate-50 p-4 rounded">
                  <div className="flex justify-between text-sm text-slate-600">
                    <div>Subtotal</div>
                    <div>${formatCurrency(subtotal)}</div>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <div>Discount</div>
                    <div className="text-green-600"> {invoice.discount ? `$${formatCurrency(invoice.discount)}` : <button className="text-green-600 underline text-sm">Add</button>} </div>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <div>Tax</div>
                    <div className="text-green-600">{invoice.tax ? `$${formatCurrency(invoice.tax)}` : <button className="text-green-600 underline text-sm">Add</button>}</div>
                  </div>

                  <div className="mt-3 border-t pt-3 flex justify-between items-center">
                    <div className="font-semibold">Total</div>
                    <div className="font-bold text-lg">${formatCurrency(total)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* right/side column */}
          <aside className="space-y-6">
            <div className="bg-white border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Client Details</div>
                  <div className="font-medium">{invoice.to.name}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  {/* avatar placeholder */}
                  <span className="text-sm font-medium text-slate-700">{invoice.to.name.charAt(0)}</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                {invoice.to.addressLines?.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
                {invoice.to.email && <div className="mt-2 text-xs text-slate-500">{invoice.to.email}</div>}
              </div>
            </div>

            <div className="bg-white border rounded p-4">
              <div className="text-sm text-slate-500">Basic Info</div>
              <div className="mt-3 text-sm space-y-2 text-slate-700">
                <div>
                  <div className="text-xs text-slate-500">Invoice Date</div>
                  <div className="font-medium">{format(new Date(invoice.issuedAt), "dd MMM yyyy")}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Due Date</div>
                  <div className="font-medium">{format(new Date(invoice.dueDate), "dd MMM yyyy")}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Status</div>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${invoice.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {invoice.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onPrint?.(invoice)}
                className="flex-1 inline-flex items-center justify-center gap-2 border rounded px-3 py-2 text-sm hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" /> Print
              </button>

              <button
                onClick={() => onEdit?.(invoice)}
                className="inline-flex items-center gap-2 bg-yellow-50 border rounded px-3 py-2 text-sm hover:bg-yellow-100"
              >
                <Edit className="h-4 w-4" /> Edit
              </button>
            </div>

            <div>
              <button
                onClick={() => onClose?.()}
                className="w-full inline-flex items-center justify-center gap-2 border rounded px-3 py-2 text-sm hover:bg-slate-50"
              >
                <X className="h-4 w-4" /> Close
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------- sample invoice (for preview) ---------- */
const sampleInvoice: Invoice = {
  id: "1",
  invoiceNumber: "MAG 2541420",
  issuedAt: "2022-04-10",
  dueDate: "2022-04-20",
  from: {
    name: "Maglo",
    email: "sales@maglo.com",
    addressLines: ["1333 Grey Fox Farm Road", "Houston, TX 77060", "Bloomfield Hills, Michigan (MI), 48301"],
  },
  to: {
    name: "Sajib Rahman",
    addressLines: ["3471 Rainy Day Drive", "Needham, MA 02192"],
    email: "sajib@example.com",
  },
  items: [
    { id: "i1", name: "Iphone 13 Pro Max", description: "", orderType: "01", rate: 244, quantity: 1 },
    { id: "i2", name: "Netflix Subscription", description: "", orderType: "01", rate: 420, quantity: 1 },
  ],
  discount: 0,
  tax: 0,
  status: "Unpaid",
};
