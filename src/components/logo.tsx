import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>KalConnect Logo</title>
      <path d="M10 5.57217C10.5939 4.61311 11.7029 4 13 4C14.6569 4 16 5.34315 16 7C16 8.65685 14.6569 10 13 10H10V5.57217Z" stroke="hsl(var(--primary))" strokeWidth="2.5" />
      <path d="M10 10L16 20" stroke="hsl(var(--primary))" strokeWidth="2.5" />
      <path d="M10 5V20" stroke="hsl(var(--foreground))" strokeWidth="2" />
    </svg>
  );
}
