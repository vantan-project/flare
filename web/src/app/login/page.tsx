"use client";

import { Input } from "@/components/input/input";
import { authLogin, AuthLoginRequest } from "@/lib/api/auth-login";
import { authMe } from "@/lib/api/auth-me";
import { useErrorStore } from "@/stores/use-error-store";
import { useMeStore } from "@/stores/use-me-store";
import { useToastStore } from "@/stores/use-toast-store";
import { accessToken } from "@/utils/access-token";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

function Page() {
  const { register, handleSubmit, getValues } = useForm<AuthLoginRequest>();
  const { setErrors } = useErrorStore();
  const { addToast } = useToastStore();
  const { setMe } = useMeStore();
  const router = useRouter();

  const meApi = () => {
    authMe().then((res) => {
      setMe(res.data);
    });
  };

  const onSubmit = (values: AuthLoginRequest) => {
    authLogin(values).then((res) => {
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
    <form className="px-5 flex flex-col">
      <div className="text-[24px] font-medium mb-15 text-center">ログイン</div>
      <div className="flex flex-col gap-4">
        <Input
          label="メールアドレス"
          placeholder="example@mail.com"
          type="text"
          {...register("email")}
        />
        <Input
          label="パスワード"
          placeholder="パスワードを入力"
          type="password"
          {...register("password")}
        />
      </div>

      <button className="block text-[14px] w-full text-right cursor-pointer">
        パスワードを忘れた方はこちら
      </button>

      <button
        className="block w-full text-white p-4 font-medium bg-primary hover:bg-primary-hover rounded-[20px] text-[16px] mt-15 cursor-pointer"
        type="button"
        onClick={handleSubmit(onSubmit)}
      >
        ログイン
      </button>
      <Link
        href="/register"
        className="text-[14px] mt-3.75 cursor-pointer mx-auto"
      >
        新規登録も方はこちら
      </Link>
    </form>
  );
}

export default Page;
