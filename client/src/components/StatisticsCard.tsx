import { Card } from "@heroui/card";

interface StatisticsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

export default function StatisticsCard({
  title,
  value,
  icon,
}: StatisticsCardProps) {
  return (
    <Card className="border border-transparent bg-background dark:border-default-100">
      <div className="flex p-4">
        <div className="flex flex-col gap-y-2">
          <dt className="text-small font-medium text-default-500">{title}</dt>
          <dd className="text-2xl font-semibold text-default-700">{value}</dd>
        </div>
        <div className="absolute right-4 text-default-500">{icon}</div>
      </div>
    </Card>
  );
}
