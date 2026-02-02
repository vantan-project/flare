import { cn } from "@/utils/cn";

export type InputProps = {
  label?: string;
  errorMessage?: string;
  icon?: React.ReactNode;

  // デフォルトのinputタグと同じ
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "number";
  placeholder?: string;
};

export default function Input({
  label,
  errorMessage,
  icon,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <label className="block">
      {label && <p className="pl-2 mb-2 font-medium">{label}</p>}
      <div
        className={cn(
          "flex gap-2 p-4 border rounded-[16px] focus-within:border-primary",
          errorMessage && "bg-error/20 border-error"
        )}
      >
        <input
          className="w-full outline-none [&::-webkit-inner-spin-button]:[-webkit-appearance:none]"
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
          !errorMessage && "opacity-0"
        )}
      >
        {errorMessage}
      </p>
    </label>
  );
}
