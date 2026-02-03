import { useErrorStore } from "@/stores/use-error-store";
import { cn } from "@/utils/cn";
import { forwardRef } from "react";

export type InputProps = {
  label?: string;
  icon?: React.ReactNode;

  // デフォルトのinputタグと同じ
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "number";
  placeholder?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, name, type = "text", placeholder, value, onChange }, ref) => {
    const { error } = useErrorStore(name);
    return (
      <label className="block">
        {label && <p className="pl-2 mb-2 font-medium">{label}</p>}
        <div
          className={cn(
            "flex gap-2 p-4 border rounded-2xl focus-within:border-primary",
            error && "bg-error/20 border-error"
          )}
        >
          <input
            ref={ref}
            className="w-full outline-none [&::-webkit-inner-spin-button]:[-webkit-appearance:none] autofill:bg-transparent bg-clip-text"
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
          />
          {icon && <div>{icon}</div>}
        </div>
        <p
          className={cn(
            "h-lh text-error text-xs leading-none ml-2 mt-1",
            !error && "opacity-0"
          )}
        >
          {error}
        </p>
      </label>
    );
  }
);
