import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
const events = [
  { time: '10:00', title: 'An event', date: 'Wednesday, 24 Aug' },
];

export default function TaskManager() {
  return (
    <Card className="p-4 bg-background border border-default-300" shadow="none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Tasks</h3>
        <Button size="sm" variant="ghost">
          View All
        </Button>
      </div>
      <div className="space-y-2">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-default-100 rounded"
          >
            <div>
              <p className="font-medium">{event.time}</p>
              <p className="text-sm text-default-500">{event.title}</p>
            </div>
            <Button size="sm" variant="ghost">
              +
            </Button>
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <Button color="primary" size="sm">
            + Add task
          </Button>
        </div>
      </div>
    </Card>
  );
}
