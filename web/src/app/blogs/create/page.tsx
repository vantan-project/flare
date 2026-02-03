"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@/components/editor/editor"),
  { ssr: false }
);

export default function TestPage() {
  return (
    <div>
      <Editor />
    </div>
  );
}
