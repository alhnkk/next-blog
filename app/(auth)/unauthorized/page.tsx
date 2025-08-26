import { Button } from "@/components/ui/button"
import { LockIcon, MoveLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const UnauthorizedPage = () => {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <LockIcon className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Yetkisiz Erişim</h1>
          <p className="mt-4 text-muted-foreground">
          Bu kaynağa erişmek için gerekli izinlere sahip değilsiniz. 
          </p>
          <div className="mt-6">
            <Image
              src="/logo.jpeg"
              alt="Unauthorized access illustration"
              className="mx-auto"
              width="300"
              height="300"
              style={{ aspectRatio: "300/300", objectFit: "cover" }}
            />
          </div>
        </div>
         <div className="flex items-center gap-x-6 my-6">
        <Link href="/">
        <Button variant="link">
            <MoveLeft />
            Ana Sayfaya Dön
          </Button>
        </Link>
        <Link href="/login">
        <Button variant="outline">
            Giriş Yap
          </Button>
        </Link>
         </div>
      </div>
    )
  }

  export default UnauthorizedPage