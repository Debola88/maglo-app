import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  figure: number | string;
  icon: ReactNode;
  iconColor?: string;
  formatFigure?: (value: number | string) => string;
  bgColor?: string;
  textColor?: string;
}

export default function SectionCard({
  title,
  figure,
  icon,
  iconColor,
  bgColor,
  textColor,
  formatFigure = (value) => value.toString(),
}: SectionCardProps) {
  return (
    <Card
      className={`bg-[#F8F8F8] aria-hidden border-0 ${bgColor}`}
      suppressHydrationWarning
    >
      <CardContent className="flex items-center gap-4">
        <div className={`p-3 rounded-full text-lg bg-[#EBE8E8] ${iconColor}`}>
          {icon}
        </div>
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className={`text-2xl max-md:text-xl font-semibold tabular-nums @[250px]/card:text-3xl ${textColor}`}>
            ${formatFigure(figure)}
          </CardTitle>
        </div>
      </CardContent>
    </Card>
  );
}