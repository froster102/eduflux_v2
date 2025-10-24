import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AnalyticsChartProps {
  title: string;
  angleAxisDataKey: string;
  radarDataKey: string;
  name: string;
  timeframe: "weekly" | "monthly";
  data: any[];
  classNames?: {
    wrapper?: string;
  };
}

export default function AnalyticsRadarChart({
  title,
  angleAxisDataKey,
  name,
  radarDataKey,
  data,
  classNames,
}: AnalyticsChartProps) {
  return (
    <Card className={`w-full bg-background ${classNames?.wrapper}`}>
      <CardHeader>
        <p className="font-medium">{title}</p>
      </CardHeader>
      <CardBody className="w-full">
        <ResponsiveContainer height={250} width="100%">
          <RadarChart cx="50%" cy="50%" data={data} outerRadius="80%">
            <PolarGrid strokeWidth={0.2} />
            <PolarAngleAxis
              className="text-sm antialiased"
              dataKey={angleAxisDataKey}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Radar
              dataKey={radarDataKey}
              fill="#e6e5e5"
              fillOpacity={0.6}
              name={name}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

const CustomTooltip = ({
  payload,
}: {
  active?: boolean;
  payload?: Array<any>;
  label?: string | number;
}) => {
  return (
    <Card
      className="p-2 bg-background border border-transparent dark:border-default-100"
      radius="sm"
      shadow="none"
    >
      <CardHeader className="p-0">
        <p className="text-xs">
          <span className="text-default-500 pr-4">Login</span>{" "}
          {payload && payload[0]?.payload?.value}
        </p>
      </CardHeader>
    </Card>
  );
};
