import React from "react";

type ButtonVariant = "primary" | "accent" | "danger" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-[#F4E869] border-2 border-transparent hover:bg-gray-900 disabled:hover:bg-black",
  accent:
    "bg-[#F4E869] text-black border-2 border-[#F4E869] hover:bg-yellow-300",
  danger: "bg-red-600 text-white border-2 border-red-700 hover:bg-red-700",
  ghost:
    "bg-transparent text-black border-2 border-transparent hover:bg-[#F4E869]/10",
};

type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  className?: string;
  variant?: ButtonVariant;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
}) => {
  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};
