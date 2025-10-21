export default function MasterCardIcon(props: IconSvgProps) {
  return (
    <svg
      height={48}
      viewBox="0 0 24 24"
      width={48}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="currentColor" fillRule="evenodd">
        <circle cx={7} cy={12} r={7} />
        <circle cx={17} cy={12} fillOpacity={0.8} r={7} />
      </g>
    </svg>
  );
}
