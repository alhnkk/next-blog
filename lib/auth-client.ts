import {
    createAuthClient
} from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
    // ✅ OPTIMIZED: Correct base URL for production
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 
             (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000"),
    basePath: "/api/auth",
    plugins: [
        adminClient()
    ]
})

export const {
    signIn,
    signOut,
    signUp,
    useSession,
    getSession
} = authClient;