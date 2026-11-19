import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
}

export default function Button({
  children,
  onClick,
  onMouseEnter,
  type = "button",
  className = "",
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`button ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}
