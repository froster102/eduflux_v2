import { Card, CardBody, CardFooter } from "@heroui/card";

import MasterCardIcon from "@/components/icons/MasterCardIcon";

interface TotalEarningCardProps {
  userName: string;
  earning: number;
}

export default function TotalEarningCard({
  userName,
  earning,
}: TotalEarningCardProps) {
  return (
    <Card className="bg-primary text-zinc-950 w-full lg:w-1/3">
      <CardBody className="p-6">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Total Earnings</p>
          <p className="text-2xl font-bold">${earning?.toFixed(2)}</p>
        </div>
      </CardBody>
      <CardFooter className="p-6 justify-between">
        <p className="text-lg font-semibold">{userName}</p>
        <MasterCardIcon width={48} />
      </CardFooter>
    </Card>
  );
}
