import React from "react";
import { forwardRef } from "react";


interface BaseProps {
  label?: string;
  type?: "text" | "number" | "email" | "password" | "textarea";
  className?: string;
}

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, type = "text", className, ...props }, ref) => {
    return <div className="w-full">
      {
        label && (
          <label className="block font-semibold text-gray-300 mb-1">
            {label}
          </label>
        )
      }

      {
        type === "textarea" ? (
          <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} {...(props as  TextareaProps)} className={`w-full p-2 outline-none rounded-md text-white border border-gray-700 ${className}`} />
        ) : (
          <input ref={ref as React.RefObject<HTMLInputElement>} type={type} {...(props as InputProps)} className={`w-full p-2 outline-none rounded-md text-white border border-gray-700 ${className}`} />
        )
      }
    </div>
  }
);

Input.displayName = "Input";

export default Input;