import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
const groups = [
  { name: "UI/UX Group A", students: 28, color: "green" },
  { name: "UI/UX Group B", students: 28, color: "yellow" },
  { name: "Motion Design Group", students: 28, color: "green" },
  { name: "Motion Design Group", students: 28, color: "yellow" },
];

export default function UpcomingSessionSection() {
  return (
    <Card className="p-4 bg-background border border-default-300" shadow="none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming sessions</h3>
        <Button size="sm" variant="ghost">
          View All
        </Button>
      </div>
      <div className="space-y-2">
        {groups.map((group, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-default-100 rounded cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{group.name}</span>
            </div>
            {/* <Icon
                  className="text-default-500"
                  icon="solar:arrow-right-outline"
                /> */}
          </div>
        ))}
      </div>
    </Card>
  );
}
