import Input from "@/components/input/input";
import Link from "next/link";

function Page() {
  return (
    <div className="px-5">
      <div className="flex flex-col gap-4">
        <div className="font-medium text-[20px] py-5 flex justify-center">
          新規登録
        </div>

        <Input
          label="ユーザー名"
          errorMessage="ユーザー名は必須です。"
          placeholder="ユーザー名"
          type="text"
        />

        <Input
          label="メールアドレス"
          errorMessage=""
          placeholder="example@mail.com"
          type="text"
        />

        <Input
          label="パスワード"
          errorMessage=""
          placeholder="パスワード入力"
          type="password"
        />

        <Input
          label="パスワード確認"
          errorMessage=""
          placeholder="パスワードを入力"
          type="password"
        />
      </div>

      <button className="block w-full text-white p-4 font-medium bg-primary rounded-[20px] text-[16px] my-5 hover:bg-primary-hover cursor-pointer">
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
