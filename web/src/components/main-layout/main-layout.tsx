"use client";

import { useEffect } from "react";
import { Footer } from "../footer/footer";
import { Toast } from "../toast/toast";
import { authMe } from "@/lib/api/auth-me";
import { useMeStore } from "@/stores/use-me-store";
import Image from "next/image";

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
      <Toast placement="top-center" zIndex={10000} />
      <div className="fixed z-40 top-0 inset-x-0 bg-base border-b-2 border-primary rounded-b-2xl">
        <Image
          src="/logo.png"
          alt="Flare Logo"
          width={420}
          height={240}
          className="w-42 h-auto p-4 pb-2"
          unoptimized
        />
      </div>
      <div className="pt-42">{children}</div>
      <div className="h-20" />
      <div className="fixed bottom-0 inset-x-0 z-80">
        <Footer />
      </div>
    </>
  );
}
