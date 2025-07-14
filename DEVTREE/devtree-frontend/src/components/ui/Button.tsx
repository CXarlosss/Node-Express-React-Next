import { ButtonHTMLAttributes } from "react";

export const Button = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="w-full py-2 rounded-md bg-green-500 text-black font-semibold hover:bg-green-400 transition"
  >
    {children}
  </button>
);
