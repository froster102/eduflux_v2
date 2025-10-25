import { Card } from '@heroui/card';

interface StatisticsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatisticsCardProps) {
  return (
    <Card className="p-4 bg-background border border-default-300" shadow="none">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-default-500">{title}</span>
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </Card>
  );
}
