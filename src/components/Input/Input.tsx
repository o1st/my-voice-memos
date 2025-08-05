import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="box-border">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full max-w-full px-3 py-2 border border-[#F4E869]/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4E869] focus:border-transparent bg-white text-black placeholder-gray-400 ${className}`}
        {...props}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  )
);
