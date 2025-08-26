import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import Link from "next/link";

interface ContactProps {
  title?: string;
  description?: string;
  email?: string;
}

const Contact = ({
  title = "İletişim",
  description = "Sorularınız, geri bildirimleriniz veya işbirliği için yazabilirsiniz. Nasıl yardımcı olabileceğim hakkında bilgi vermeyi unutmayın.",
  email = "alhnkk@gmail.com",
}: ContactProps) => {
  return (
    <section className="py-32 flex items-center justify-between mx-auto">
        <div className="mx-auto flex flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-16">
            <div className="text-center lg:text-left">
              <h1 className="mb-12 text-5xl font-semibold lg:mb-1 lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground mt-8">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              
                
                  <span className="font-bold">E-Posta: </span>
                  <Link href={`mailto:${email}`} className="underline">
                    {email}
                  </Link>
              
            </div>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border p-10">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">Ad</Label>
                <Input type="text" id="firstname" placeholder="Ad" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Soy Adı</Label>
                <Input type="text" id="lastname" placeholder="Soy Ad" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">E-Posta</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Konu</Label>
              <Input type="text" id="subject" placeholder="Subject" />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Mesaj</Label>
              <Textarea placeholder="Type your message here." id="message" />
            </div>
            <Button className="w-full">
                <Send />
                Gönder
            </Button>
          </div>
        </div>
    </section>
  );
};

export default Contact
