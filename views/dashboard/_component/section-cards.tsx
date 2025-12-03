import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  figure: number | string;
  trend: number;
  trendLabel: string;
  icon: ReactNode;
  badgeColor: string;
  formatFigure?: (value: number | string) => string;
}

export default function SectionCard({
  title,
  figure,
  trend,
  trendLabel,
  icon,
  badgeColor,
  formatFigure = (value) => value.toString(),
}: SectionCardProps) {
  const isPositiveTrend = trend >= 0;

  return (
    <Card className="bg-white" suppressHydrationWarning>
      <CardContent className="flex items-center">
        <CardHeader className={`p-3 rounded-2xl text-xl ${badgeColor}`}>
          {icon}
        </CardHeader>
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl max-md:text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatFigure(figure)}
          </CardTitle>
        </div>
      </CardContent>
    </Card>
  );
}
