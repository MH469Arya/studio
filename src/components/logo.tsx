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
      <path d="M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5" stroke="hsl(var(--foreground))" strokeWidth="2" />
      <path d="M12 7h2a3 3 0 0 1 3 3 3 3 0 0 1-3 3h-2" stroke="hsl(var(--primary))" strokeWidth="2.5" />
      <path d="M12 12l5 5" stroke="hsl(var(--primary))" strokeWidth="2.5" />
    </svg>
  );
}
