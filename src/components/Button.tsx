import type { ButtonProps } from "../assets/types";

const variants = {
  primary:
    "bg-primary text-white px-6 py-2 rounded-full font-ui hover:opacity-80 transition",
  secondary:
    "bg-secondary text-white rounded-full font-ui hover:opacity-80 transition",
  "outline-primary":
    "border border-primary text-primary rounded-full font-ui hover:bg-primary hover:text-white transition",
  danger:
    "bg-red-600 border border-red-600 text-white rounded-full font-ui hover:bg-red-700 hover:text-white transition",
  "outline-danger":
    " border border-red-600 text-red-700 rounded-full font-ui hover:bg-red-600 hover:text-white transition",
  success:
    "bg-green-600 border border-green-600 text-white rounded-full font-ui hover:bg-green-700 hover:text-white transition",
};
export default function Button({ children, variant, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`cursor-pointer disabled:opacity-50 px-6 py-2 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
