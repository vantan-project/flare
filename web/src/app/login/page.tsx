import Input from "@/components/input/input";
import Link from "next/link";

function Page() {
  return (
    <div>
      <div className="px-5 flex flex-col">
        <div className="text-[24px] font-medium mb-15 text-center">
          ログイン
        </div>
        <div className="flex flex-col gap-4">
          <Input
            label="メールアドレス"
            errorMessage=""
            placeholder="example@mail.com"
            type="text"
          />
          <Input
            label="パスワード"
            errorMessage="asdfgd"
            placeholder="パスワードを入力"
            type="password"
          />
        </div>

        <button className="block text-[14px] w-full text-right cursor-pointer">
          パスワードを忘れた方はこちら
        </button>

        <button className="block w-full text-white p-4 font-medium bg-primary hover:bg-primary-hover rounded-[20px] text-[16px] mt-15 cursor-pointer">
          ログイン
        </button>
        <Link
          href="/register"
          className="text-[14px] mt-3.75 cursor-pointer mx-auto"
        >
          新規登録も方はこちら
        </Link>
      </div>
    </div>
  );
}

export default Page;
