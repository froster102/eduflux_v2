import { Card, CardBody, CardHeader } from '@heroui/card';
import { Select, SelectItem } from '@heroui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import { CustomTooltip } from '@/components/CustomToolTip';
import { PaymentType } from '@/shared/enums/PaymentType';

interface PaymentsGraphProps {
  graphData: any[];
  type: PaymentType;
  setType: (type: PaymentType) => void;
}

export default function PaymentsGraph({
  graphData,
  type,
  setType,
}: PaymentsGraphProps) {
  const formatYAxis = (value: number) =>
    value < 1000 ? value.toFixed(0) : `${(value / 1000).toFixed(1)}k`;

  return (
    <Card
      className="bg-transparent border border-default-300 text-zinc-950 w-full lg:w-2/3"
      shadow="none"
    >
      <CardHeader className="px-8">
        <Select
          className="w-40 border border-default-300 rounded-lg dark:text-zinc-100"
          selectedKeys={new Set([type])}
          size="sm"
          onSelectionChange={(value) => setType(value.anchorKey as PaymentType)}
        >
          <SelectItem key={PaymentType.COURSE_PURCHASE}>
            Course Purchase
          </SelectItem>
          <SelectItem key={PaymentType.SESSION_BOOKING}>
            Session Booking
          </SelectItem>
        </Select>
      </CardHeader>
      <CardBody className="p-2">
        <ResponsiveContainer height={250} width="100%">
          <LineChart data={graphData}>
            <XAxis
              axisLine={false}
              dataKey="label"
              stroke="#fff"
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              domain={[0, 'auto']}
              stroke="#fff"
              tickFormatter={formatYAxis}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line
              dataKey="instructorRevenue"
              dot={false}
              name="Instructor Revenue"
              stroke="#82ca9d"
              type="monotone"
            />
            <Line
              dataKey="platformFee"
              dot={false}
              name="Platform Fee"
              stroke="#8884d8"
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
