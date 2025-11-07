import { Card, CardBody, CardHeader } from '@heroui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueTrendsLineChartProps {
  data?: RevenueData[];
}

export default function RevenueTrendsLineChart({
  data,
}: RevenueTrendsLineChartProps) {
  // Mock data - showing revenue trends over 6 months
  const mockData: RevenueData[] = data || [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 18900 },
    { month: 'Mar', revenue: 15200 },
    { month: 'Apr', revenue: 22100 },
    { month: 'May', revenue: 28700 },
    { month: 'Jun', revenue: 32400 },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }

    return `$${value.toFixed(0)}`;
  };

  return (
    <Card
      className="w-full bg-background border border-default-300"
      shadow="none"
    >
      <CardHeader>
        <p className="font-medium text-foreground">Platform Revenue Trends</p>
      </CardHeader>
      <CardBody className="w-full">
        <ResponsiveContainer height={300} width="100%">
          <LineChart
            data={mockData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid
              className="stroke-default-200 dark:stroke-default-100"
              opacity={0.3}
              strokeDasharray="3 3"
            />
            <XAxis
              axisLine={false}
              className="text-sm text-foreground"
              dataKey="month"
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              className="text-sm text-foreground"
              domain={[0, 'auto']}
              tickFormatter={formatCurrency}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Line
              dataKey="revenue"
              dot={false}
              name="Platform Revenue"
              stroke="#22c55e"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<any>;
  label?: string | number;
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <Card
      className="p-2 bg-background border border-transparent dark:border-default-100"
      radius="sm"
      shadow="sm"
    >
      <CardHeader className="p-0">
        <p className="text-xs font-semibold text-foreground">{label}</p>
      </CardHeader>
      <CardBody className="p-1">
        <p className="text-xs text-default-600 dark:text-default-400">
          <span className="text-primary font-medium">
            Platform Revenue: ${data.revenue.toLocaleString()}
          </span>
        </p>
      </CardBody>
    </Card>
  );
};
