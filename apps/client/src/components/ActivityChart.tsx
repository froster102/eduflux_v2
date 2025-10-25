import { Card, CardBody, CardHeader } from '@heroui/card';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function ActivityChart() {
  const monthlyData = [
    { month: 'January', activity: 120 },
    { month: 'February', activity: 95 },
    { month: 'March', activity: 150 },
    { month: 'April', activity: 200 },
    { month: 'May', activity: 80 },
    { month: 'June', activity: 180 },
  ];

  return (
    <Card className="w-full bg-secondary-500 dark:bg-default-50">
      <CardHeader>
        <p className="font-medium">Activity</p>
      </CardHeader>
      <CardBody className="w-full max-h-96 p-1">
        <ResponsiveContainer height={200} width="100%">
          <BarChart
            accessibilityLayer
            data={monthlyData}
            height={300}
            width={500}
          >
            <XAxis
              axisLine={false}
              className="text-sm"
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              className="max-w-sm"
              dataKey="activity"
              fill="#82ca9d"
              radius={8}
              width={30}
            />
          </BarChart>
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
          <span className="text-default-500 pr-4">Activity</span>{' '}
          {payload && payload[0]?.payload?.activity}
        </p>
      </CardHeader>
    </Card>
  );
};
