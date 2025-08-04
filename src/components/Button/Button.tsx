import React from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = Omit<
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
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
  const primary =
    "bg-black text-[#F4E869]/90 border-2 border-[#F4E869]/80 hover:bg-gray-900 disabled:hover:bg-black";
  const secondary =
    "bg-transparent text-black/90 border-2 border-black/80 hover:bg-[#F4E869]/5 disabled:hover:bg-transparent";
  const variantClass = variant === "primary" ? primary : secondary;

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
