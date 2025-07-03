import { SVGProps } from "react";

export default function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx={12} cy={12} r={10} />
        <path d="M15 12H9" strokeLinecap="round" />
      </g>
    </svg>
  );
}
