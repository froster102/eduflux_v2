import { createFileRoute } from "@tanstack/react-router";

import { getGreeting } from "@/utils/date";
import { useAuthStore } from "@/store/auth-store";
import StatisticsCard from "@/components/StatisticsCard";

export const Route = createFileRoute("/_layout/home/")({
  component: RouteComponent,
});

const stats = [
  {
    title: "Enrollmented Courses",
    icon: <></>,
    value: "102",
  },
  {
    title: "Completed Courses",
    icon: <></>,
    value: "32",
  },
  {
    title: "Sessions Attempted",
    icon: <></>,
    value: "10",
  },
];

function RouteComponent() {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center pr-2 w-full">
        <div className="w-full">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-medium">
            {getGreeting()}, {user?.name.split(" ")[0]} 👋
          </p>
          <p className="text-sm  pt-2">
            Welcome to Eduflux, check your priority learning.
          </p>
        </div>
        <div className="flex w-full gap-4">
          {stats.map((stat, i) => (
            <StatisticsCard key={i} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
