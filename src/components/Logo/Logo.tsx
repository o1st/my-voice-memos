import React from "react";
import logo from "../../assets/logo.svg"; // Assuming you have a logo.svg file in the same directory

type LogoProps = {
  variant?: "normal" | "small";
};

export const Logo: React.FC<LogoProps> = ({ variant = "normal" }) => {
  const width = variant === "small" ? 120 : 200;

  return (
    <span className="flex items-center gap-2 select-none">
      <img src={logo} alt="Logo" style={{ width, height: "auto" }} />
    </span>
  );
};
