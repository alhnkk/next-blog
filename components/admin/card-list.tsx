"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils/date";
import { Key } from "lucide-react";
import { CenterLoading } from "@/components/ui/loading";
import { getUsers } from "@/lib/actions/users";
import { getRecentMessages, Message } from "@/lib/actions/messages";

const lastMessages = [
  {
    id: 1,
    title: "JavaScript Tutorial",
    badge: "Coding",
    image:
      "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 4300,
  },
  {
    id: 2,
    title: "Tech Trends 2025",
    badge: "Tech",
    image:
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 3200,
  },
  {
    id: 3,
    title: "The Future of AI",
    badge: "AI",
    image:
      "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2400,
  },
  {
    id: 4,
    title: "React Hooks Explained",
    badge: "Coding",
    image:
      "https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1500,
  },
  {
    id: 5,
    title: "Image Generation with AI",
    badge: "AI",
    image:
      "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1200,
  },
];

const lastUsers = [
  {
    id: 1,
    title: "Ali Akman",
    badge: "aliakman34@gmail.com",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800",
    method: "google",
  },
  {
    id: 2,
    title: "Ayşe Yılmaz",
    badge: "asymz3455@gmail.com",
    image:
      "https://images.pexels.com/photos/4969918/pexels-photo-4969918.jpeg?auto=compress&cs=tinysrgb&w=800",
    method: "apple",
  },
  {
    id: 3,
    title: "Erhan Dural",
    badge: "rhndrl23@gmail.com",
    image:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800",
    method: "credentials",
  },
  {
    id: 4,
    title: "Sami Aydoğan",
    badge: "aydogan_sami@outlook.com",
    image:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=800",
    method: "google",
  },
  {
    id: 5,
    title: "Murat Kara",
    badge: "muratkaraofficial@hotmail.com",
    image:
      "https://images.pexels.com/photos/1680175/pexels-photo-1680175.jpeg?auto=compress&cs=tinysrgb&w=800",
    method: "credentials",
  },
];

const MethodIcon = ({ method }: { method: string }) => {
  switch (method) {
    case "google":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
        </svg>
      );
    case "apple":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
        </svg>
      );
    case "credentials":
      return <Key className="w-5 h-5" />;
    default:
      return null;
  }
};

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CardList = ({ title }: { title: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (title === "Son Üyeler") {
      const loadUsers = async () => {
        try {
          const result = await getUsers();
          if (result.success && result.data) {
            // Son 5 üyeyi al
            setUsers(result.data.slice(0, 5));
          }
        } catch (error) {
          console.error("Error loading users:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadUsers();
    } else if (title === "Son Mesajlar") {
      const loadMessages = async () => {
        try {
          const recentMessages = await getRecentMessages(5);
          setMessages(recentMessages);
        } catch (error) {
          console.error("Error loading messages:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadMessages();
    } else {
      setIsLoading(false);
    }
  }, [title]);


  if (title === "Son Üyeler") {
    if (isLoading) {
      return (
        <div className="">
          <h1 className="text-lg font-medium mb-6">{title}</h1>
          <CenterLoading size="sm" message="" />
        </div>
      );
    }

    return (
      <div className="">
        <h1 className="text-lg font-medium mb-6">{title}</h1>
        <div className="flex flex-col gap-2">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Henüz üye bulunmuyor</p>
            </div>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="flex-row items-center justify-between gap-4 p-4">
                <div className="w-12 h-12 rounded-full relative overflow-hidden bg-gray-200">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                      quality={70}
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {formatTimeAgo(user.createdAt)}
                  </Badge>
                </CardContent>
                <CardFooter className="p-0">
                  <div className="text-xs text-gray-500 max-w-[100px] truncate">
                    {user.email}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Son Mesajlar için gerçek veri
  if (title === "Son Mesajlar") {
    if (isLoading) {
      return (
        <div className="">
          <h1 className="text-lg font-medium mb-6">{title}</h1>
          <CenterLoading size="sm" message="" />
        </div>
      );
    }

    return (
      <div className="">
        <h1 className="text-lg font-medium mb-6">{title}</h1>
        <div className="flex flex-col gap-2">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Henüz mesaj bulunmuyor</p>
            </div>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className={`flex-row items-center justify-between gap-4 p-4 ${!message.read ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                <div className="w-12 h-12 rounded-full relative overflow-hidden bg-gray-200 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium">
                    {message.name?.charAt(0).toUpperCase() || "M"}
                  </div>
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {message.name}
                    {!message.read && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        Yeni
                      </Badge>
                    )}
                    {message.replied && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Yanıtlandı
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {message.subject || message.content.substring(0, 50) + "..."}
                  </div>
                </CardContent>
                <CardFooter className="p-0">
                  <div className="text-xs text-gray-500">
                    {formatTimeAgo(message.createdAt)}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Diğer durumlar için eski statik veri
  const list = lastMessages;
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {list.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between gap-4 p-4">
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                quality={70}
                sizes="48px"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Badge variant="secondary">{item.badge}</Badge>
            </CardContent>
            <CardFooter className="p-0">
              <div className="text-sm text-gray-600">{item.count}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;