import { button } from "motion/react-client";

export function EditButton() {
  return (
    <button className="border border-black rounded-[100px]">
      <span className="text-[12px] text-black p-3">編集</span>
    </button>
  );
}