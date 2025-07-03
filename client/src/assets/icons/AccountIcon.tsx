import { SVGProps } from "react";

export default function AccountIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx={12} cy={9} r={3} />
        <circle cx={12} cy={12} r={10} />
        <path
          d="M17.97 20c-.16-2.892-1.045-5-5.97-5s-5.81 2.108-5.97 5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
