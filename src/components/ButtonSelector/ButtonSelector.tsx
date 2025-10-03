import React from "react";

interface ButtonSelectorProps {
  options: string[];                 // Button labels
  color?: string;                    // Tailwind color (e.g. "blue", "green", "red")
  value: string;                     // Currently selected value
  onChange: (val: string) => void;   // Notify parent of selection
  size?: "sm" | "md" | "lg";         // Optional button sizing
}

export const ButtonSelector: React.FC<ButtonSelectorProps> = ({
  options,
  color = "blue",
  value,
  onChange,
  size = "md",
}) => {
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-1"
      : size === "lg"
      ? "text-lg px-4 py-2"
      : "text-sm px-3 py-1.5";

  return (
    <div className="inline-flex rounded-md shadow-sm border border-gray-700 overflow-hidden">
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`
              ${sizeClasses}
              focus:outline-none
              transition
              ${isActive
                ? `bg-gray-800 hover:bg-gray-700 text-white`
                : `text-gray-300`
              }
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
