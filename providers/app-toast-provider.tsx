"use client";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
      <Toaster />
    </React.Fragment>
  );
}
