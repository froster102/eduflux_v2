import { Divider } from '@heroui/divider';

export default function ScheduleGuidelines() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-semibold text-lg">Scheduling Tips</p>
        <small className="text-zinc-500">
          Set realistic hours that align with your energy levels and personal
          commitments.
        </small>
      </div>
      <Divider orientation="horizontal" />
      <div>
        <p className="font-semibold text-lg">Consider Time Zones</p>
        <small className="text-zinc-500">
          If you have clients globally, specify your availability in a way
          that&apos;s clear across different time zones.
        </small>
      </div>
      <Divider orientation="horizontal" />
      <div>
        <p className="font-semibold text-lg">Flexibility is Key</p>
        <small className="text-zinc-500">
          Offer a range of slots to accommodate diverse client schedules where
          possible.
        </small>
      </div>
    </div>
  );
}
