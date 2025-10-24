import { Divider } from "@heroui/divider";

export default function PricingGuidelines() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-semibold text-lg">Pricing Guidelines</p>
        <small className="text-zinc-500">
          Consider your expertise, market rates, and target audience when
          setting your session price.
        </small>
      </div>
      <Divider orientation="horizontal" />
      <div>
        <p className="font-semibold text-lg">Review Regularly</p>
        <small className="text-zinc-500">
          Periodically review and adjust your pricing based on demand and value
          provided.
        </small>
      </div>
      <Divider orientation="horizontal" />
      <div>
        <p className="font-semibold text-lg">Currency Choice</p>
        <small className="text-zinc-500">
          Select a currency relevant to your primary client base.
        </small>
      </div>
    </div>
  );
}
