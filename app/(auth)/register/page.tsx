import RegisterForm from "@/components/register-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image
              src="/logo.jpeg"
              width={20}
              height={20}
              alt="logo"
              priority={true}
              quality={75}
              sizes="20px"
            />
          </div>
          Jurnalize
        </Link>
        <RegisterForm />
      </div>
      <div className="max-w-md text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Giriş yapmaya devam ederek, <Link href="#">Kullanım Koşullarını</Link>{" "}
        ve <Link href="#">Gizlilik Sözleşmesini</Link> kabul etmiş olursunuz.
      </div>
    </div>
  );
}
