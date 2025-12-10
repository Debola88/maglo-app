"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface ChartDataPoint {
  date: string;
  income: number;
  expenses: number;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#14b8a6", 
  },
  expenses: {
    label: "Expenses",
    color: "#a3e635", 
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    const fetchInvoiceData = async () => {
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
          setLoading(false);
          return;
        }

        if (invoices && invoices.length > 0) {
          const processedData = processInvoicesForChart(invoices as unknown as Invoice[]);
          setChartData(processedData);
        } else {
          setChartData(generateSampleData());
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setChartData(generateSampleData());
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [user]);

  const processInvoicesForChart = (invoices: Invoice[]): ChartDataPoint[] => {
    const dataMap = new Map<string, { income: number; expenses: number }>();

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 90);

    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      dataMap.set(dateKey, { income: 0, expenses: 0 });
    }

    invoices.forEach((invoice) => {
      const invoiceDate = new Date(invoice.createdAt || invoice.dueDate);
      const dateKey = invoiceDate.toISOString().split('T')[0];

      if (dataMap.has(dateKey)) {
        const current = dataMap.get(dateKey)!;
        
        if (invoice.status === "Paid") {
          current.income += invoice.total;
        } else {
          current.expenses += invoice.total * 0.3;
        }
      }
    });

    const chartArray: ChartDataPoint[] = [];
    dataMap.forEach((value, date) => {
      chartArray.push({
        date,
        income: Math.round(value.income),
        expenses: Math.round(value.expenses),
      });
    });

    return smoothChartData(chartArray);
  };

  const smoothChartData = (data: ChartDataPoint[]): ChartDataPoint[] => {
    const windowSize = 7;
    const smoothed: ChartDataPoint[] = [];

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
      const window = data.slice(start, end);

      const avgIncome = window.reduce((sum, d) => sum + d.income, 0) / window.length;
      const avgExpenses = window.reduce((sum, d) => sum + d.expenses, 0) / window.length;

      smoothed.push({
        date: data[i].date,
        income: Math.round(avgIncome),
        expenses: Math.round(avgExpenses),
      });
    }

    return smoothed;
  };

  const generateSampleData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 90);
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const baseIncome = 5000;
      const baseExpenses = 4500;
      const variance = 2000;
      
      const income = baseIncome + (Math.random() - 0.5) * variance;
      const expenses = baseExpenses + (Math.random() - 0.5) * variance;
      
      data.push({
        date: date.toISOString().split('T')[0],
        income: Math.round(income),
        expenses: Math.round(expenses),
      });
    }
    
    return data;
  };

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Working Capital</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Working Capital</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Income vs Expenses tracking
          </span>
          <span className="@[540px]/card:hidden">Income vs Expenses</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Range</SelectLabel>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name) => {
                    const label = typeof name === 'string' 
                      ? name.charAt(0).toUpperCase() + name.slice(1)
                      : String(name);
                    return [
                      `₦${Number(value).toLocaleString()}`,
                      label,
                    ];
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              stroke="var(--color-income)"
              strokeWidth={2}
            />
            <Area
              dataKey="expenses"
              type="monotone"
              fill="url(#fillExpenses)"
              stroke="var(--color-expenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}