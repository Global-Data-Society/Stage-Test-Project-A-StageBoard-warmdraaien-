"use client";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "positive" | "negative";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  let style = "px-4 py-2 border-2 rounded-md font-medium transition duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  if (variant === "primary") {
  style += " bg-gray-600 text-white border-gray-700 hover:bg-blue-700 hover:border-blue-800 active:scale-95 focus-visible:ring-blue-400";
  }
  if (variant === "secondary") {
  style += " bg-gray-600 text-gray-200 border-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 active:scale-95 shadow-sm focus-visible:ring-gray-400";
  }
  if (variant === "danger") {
  style += " bg-gray-600 text-white border-gray-700 hover:bg-red-700 hover:border-red-800 active:scale-95 focus-visible:ring-red-400";
  }
  if (variant === "positive") {
  style += " bg-green-600 text-gray-200 border-gray-700 hover:bg-green-800 hover:text-white hover:border-gray-800 active:scale-95 shadow-sm focus-visible:ring-gray-400";
  }
    if (variant === "negative") {
  style += " bg-red-600 text-gray-200 border-gray-700 hover:bg-red-800 hover:text-white hover:border-gray-800 active:scale-95 shadow-sm focus-visible:ring-gray-400";
  }
    
  return (
    <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`${style} ${className}`}
    >
      {children}
    </button>
  );
}
