export function CheckedIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-check-icon lucide-check ${className || ""}`}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
