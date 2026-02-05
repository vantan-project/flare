"use client";

import { Input } from "@/components/input/input";
import { authRegister, AuthRegisterRequest } from "@/lib/api/auth-register";
import { authMe } from "@/lib/api/auth-me";
import { useMeStore } from "@/stores/use-me-store";
import { accessToken } from "@/utils/access-token";
import { useToastStore } from "@/stores/use-toast-store";
import { useErrorStore } from "@/stores/use-error-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

type Form = AuthRegisterRequest & {
  passwordConf: string;
};

function Page() {
  const { register, handleSubmit } = useForm<Form>();
  const { addToast } = useToastStore();
  const { setMe } = useMeStore();
  const { setErrors } = useErrorStore();
  const router = useRouter();

  const meApi = () => {
    authMe().then((res) => {
      setMe(res.data);
    });
  };
  const onSubmit = (values: Form) => {
    const { password, passwordConf } = values;
    if (password !== passwordConf) {
      setErrors({ passwordConf: "パスワードが一致しません。" });
      return;
    }
    authRegister(values).then((res) => {
      switch (res.status) {
        case "success":
          addToast("success", res.message);
          accessToken.set(res.accessToken);
          meApi();
          router.push("/");
          break;
        case "error":
          addToast("error", res.message);
          break;
        case "validation":
          setErrors(res.fieldErrors);
          break;
      }
    });
  };
  return (
    <div className="px-5 pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 items-center justify-center -mt-12">
          <Image
            src="/icon.png"
            alt="Flare icon"
            width={420}
            height={420}
            className="w-36 h-auto"
            unoptimized
          />
          <div className="text-[24px] font-medium mb-8">新規登録</div>
        </div>

        <Input
          label="ユーザー名"
          placeholder="ユーザー名"
          type="text"
          {...register("name")}
        />

        <Input
          label="メールアドレス"
          placeholder="example@mail.com"
          type="text"
          {...register("email")}
        />

        <Input
          label="パスワード"
          placeholder="パスワード入力"
          type="password"
          {...register("password")}
        />

        <Input
          label="パスワード確認"
          placeholder="パスワードを入力"
          type="password"
          {...register("passwordConf")}
        />
      </div>

      <button
        className="block w-full text-white p-4 font-medium bg-primary rounded-[20px] text-[16px] my-5 hover:bg-primary-hover cursor-pointer"
        onClick={handleSubmit(onSubmit)}
      >
        新規登録
      </button>
      <Link
        href="/login"
        className="block text-[14px] mx-auto w-fit cursor-pointer"
      >
        ログインの方はこちら
      </Link>
    </div>
  );
}

export default Page;
