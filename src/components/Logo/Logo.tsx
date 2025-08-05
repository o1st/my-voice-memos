import React from "react";
import logo from "../../assets/logo.svg";

type LogoProps = {
  variant?: "normal" | "small";
};

export const Logo: React.FC<LogoProps> = ({ variant = "normal" }) => {
  return (
    <span className="flex items-center gap-2 select-none">
      <img
        src={logo}
        alt="Logo"
        className={`h-auto ${variant === "small" ? "w-30" : "w-50"}`}
      />
    </span>
  );
};
