import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useGetUserGrowth } from '@/features/analytics/hooks/useGetUserGrowth';

export default function UserGrowthRadarChart() {
  const { data: userGrowthData, isPending: isUserGrowthDataPending } =
    useGetUserGrowth();

  // Default data if no data available - last 12 months
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const defaultData = monthNames.map((month) => ({ month, users: 0 }));

  const chartData = userGrowthData?.data ?? defaultData;

  return (
    <Card
      className="w-full bg-background border border-default-300"
      shadow="none"
    >
      <CardHeader>
        <p className="font-medium text-foreground">User Growth</p>
      </CardHeader>
      <CardBody className="w-full">
        {isUserGrowthDataPending ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer height={300} width="100%">
            <RadarChart cx="50%" cy="50%" data={chartData} outerRadius="80%">
              <defs>
                <linearGradient
                  id="userGrowthGradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <PolarGrid
                className="stroke-default-200 dark:stroke-default-300"
                strokeWidth={1}
              />
              <PolarAngleAxis
                className="text-sm text-foreground antialiased"
                dataKey="month"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Radar
                activeDot={{ fill: '#15803d', r: 6 }}
                dataKey="users"
                dot={{ fill: '#16a34a', r: 4 }}
                fill="url(#userGrowthGradient)"
                name="New Users"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}

const CustomTooltip = ({
  active,
  payload,
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
        <p className="text-xs font-semibold text-foreground">{data.month}</p>
      </CardHeader>
      <CardBody className="p-1">
        <p className="text-xs text-default-600 dark:text-default-400">
          <span className="text-primary font-medium">{data.users}</span> new
          users
        </p>
      </CardBody>
    </Card>
  );
};
