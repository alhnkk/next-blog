"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createMessage } from "@/lib/actions/messages";
import { toast } from "@/hooks/use-toast";

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createMessage({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: formData.subject,
        content: formData.message,
      });

      if (result.success) {
        toast({
          title: "Mesaj Gönderildi",
          description: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağım.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: "Hata",
          description: result.error || "Mesaj gönderilirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesaj gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border p-10">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstName">Ad</Label>
                <Input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  placeholder="Ad" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastName">Soy Adı</Label>
                <Input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  placeholder="Soy Ad" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">E-Posta</Label>
              <Input 
                type="email" 
                id="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Konu</Label>
              <Input 
                type="text" 
                id="subject" 
                name="subject"
                placeholder="Konu" 
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Mesaj</Label>
              <Textarea 
                placeholder="Mesajınızı yazın..." 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send />
                {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        </div>
    </section>
  );
};

export default Contact
