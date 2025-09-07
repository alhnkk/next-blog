import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins"

import { prismadb } from "@/lib/prismadb";

export const auth = betterAuth({
    database: prismaAdapter(prismadb, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            // Send an email to the user with a link to reset their password
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET && {
            apple: {
                clientId: process.env.APPLE_CLIENT_ID,
                clientSecret: process.env.APPLE_CLIENT_SECRET
            }
        })
    },
    plugins: [
        admin() // Admin plugin'ini ekle
    ]
    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
});
