import { Card, CardBody, CardHeader } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export default function InstructorPageSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full h-[20vh] bg-background border border-default-200">
          <CardHeader className="text-lg font-medium flex pb-0">
            <Skeleton className="w-1/4 h-6 rounded-lg" />{' '}
          </CardHeader>
          <CardBody className=" flex flex-col gap-2 pt-2">
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-3/4 h-4 rounded-lg" />
            <Skeleton className="w-3/4 h-4 rounded-lg" />
            <Skeleton className="w-3/4 h-4 rounded-lg" />
          </CardBody>
        </Card>

        <Card className="w-full h-fit bg-background border border-default-200">
          <CardHeader className="text-lg font-medium flex pb-0">
            <Skeleton className="w-1/3 h-6 rounded-lg" />{' '}
          </CardHeader>
          <CardBody className="pt-2">
            <Skeleton className="w-full h-24 rounded-lg" />{' '}
          </CardBody>
        </Card>
      </div>

      <div className="md:max-w-md w-full order-1">
        <Card className="md:max-w-lg w-full bg-background border border-default-200">
          <CardHeader>
            <Skeleton className="w-full h-[250px] rounded-lg" />{' '}
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-1/4 h-6 rounded-lg" />
              <Skeleton className="w-1/3 h-8 rounded-lg" />{' '}
            </div>
            <Skeleton className="w-full h-10 rounded-lg" />{' '}
            <Skeleton className="w-full h-10 rounded-lg" />{' '}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
