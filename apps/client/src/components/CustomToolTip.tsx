import { Card, CardBody, CardHeader } from '@heroui/card';

interface TooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string | number;
}

export const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <Card
      className="p-2 bg-background border border-transparent dark:border-default-100"
      radius="sm"
      shadow="none"
    >
      <CardHeader className="p-0">
        <p className="text-xs font-semibold">{label}</p>
      </CardHeader>
      <CardBody className="p-1">
        <p className="text-xs">
          Instructor Revenue: ${data.instructorRevenue.toFixed(2)}
        </p>
        <p className="text-xs">Platform Fee: ${data.platformFee.toFixed(2)}</p>
        <p className="text-xs">Completed Payments: {data.completedPayments}</p>
      </CardBody>
    </Card>
  );
};
