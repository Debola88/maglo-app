import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { ChartAreaInteractive } from "@/views/dashboard/_component/chart-area-interactive";
import { DataTable } from "@/views/dashboard/_component/data-table";
import SectionCard from "@/views/dashboard/_component/section-cards";
import { SiteHeader } from "@/components/layouts/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IoWallet } from "react-icons/io5";
import { GiWallet } from "react-icons/gi";
import { MdWallet } from "react-icons/md";
import data from "@/app/dashboard/data.json";
import React from "react";

const cardInfo = [
  {
    title: "Total User",
    figure: 40689,
    trend: 1.3,
    trendLabel: "from yesterday",
    icon: <IoWallet />,
    badgeColor: "bg-[#8280FF]/50 text-[#8280FF]",
    formatFigure: (value: number | string) => value.toLocaleString(),
  },
  {
    title: "Total Order",
    figure: "10293",
    trend: 1.3,
    trendLabel: "from past week",
    icon: <GiWallet />,
    badgeColor: "bg-[#FEC53D]/50 text-[#FEC53D]",
    formatFigure: (value: number | string) => value.toLocaleString(),
  },
  {
    title: "Total Sales",
    figure: "$89,000",
    trend: 1.3,
    trendLabel: "from yesterday",
    icon: <MdWallet />,
    badgeColor: "bg-[#4AD991]/50 text-[#4AD991]",
    formatFigure: (value: number | string) => value.toLocaleString(),
  },
];

export default function DashboardView() {
  return (
    <React.Fragment>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4 lg:px-6">
        {cardInfo.map((card, index) => (
          <SectionCard
            key={index}
            title={card.title}
            figure={card.figure}
            trend={card.trend}
            trendLabel={card.trendLabel}
            icon={card.icon}
            badgeColor={card.badgeColor}
            formatFigure={card.formatFigure}
          />
        ))}
      </div>

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </React.Fragment>
  );
}
