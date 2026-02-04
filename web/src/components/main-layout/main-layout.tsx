"use client";

import { useEffect } from "react";
import { Footer } from "../footer/footer";
import { Toast } from "../toast/toast";
import { authMe } from "@/lib/api/auth-me";
import { useMeStore } from "@/stores/use-me-store";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  const { setMe } = useMeStore();
  useEffect(() => {
    authMe().then((res) => setMe(res.data));
  }, []);

  return (
    <>
      <Toast placement="top-center" />
      {children}
      <div className="h-25" />
      <div className="fixed bottom-0 inset-x-0">
        <Footer />
      </div>
    </>
  );
}
