"use client"

import Link from "next/link";
import { LogOut, Settings, User2, UserLock } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    Avatar,
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

const UserNav = () => {
    const router = useRouter();
    const { data: session } = useSession();
    
    return (
        <>
            {
                session ?
                (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={session.user.image || undefined} />
                                <AvatarFallback>
                                {session.user.name
                                    ?.split(' ')
                                    .map(word => word.charAt(0))
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2) || 
                                    session.user.email?.charAt(0).toUpperCase() || 
                                    'U'}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={12}>
                            <DropdownMenuLabel className="flex flex-col">
                                <span>{session.user.name}</span>
                                <span className="text-sm text-muted-foreground">{session.user.email}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/user">
                                    <User2 className="h-[1.2rem] w-[1.2rem] mr-2" />
                                    Profil
                                </Link>

                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                                Ayarlar
                            </DropdownMenuItem>
                                {session.user.role === "admin" && (
                                <DropdownMenuItem asChild>
                                    <Link href="/admin">
                                    <UserLock className="h-[1.2rem] w-[1.2rem] mr-2" />
                                        Admin Paneli
                                    </Link>
                                </DropdownMenuItem>
                                )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                variant="destructive"
                                onClick={async () => {
                                    await signOut({
                                        fetchOptions: {
                                            onSuccess: () => {
                                                router.push("/");
                                            },
                                        },
                                    });
                                }}
                            >
                                <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                                Çıkış Yap
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
                :
                (
                    <div className="flex items-center gap-x-3">
                        <Link href="/login">
                            <Button variant="outline">Giriş Yap</Button>
                        </Link>
                    </div>
                )
            }
        </>
    );
}

export default UserNav