"use client";

import { Footer } from "../footer/footer";
import { Toast } from "../toast/toast";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <>
      <Toast placement="top-center" />
      {children}
      <div className="h-20" />
      <div className="fixed bottom-0 inset-x-0">
        <Footer />
      </div>
    </>
  );
}
