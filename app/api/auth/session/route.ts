import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    
    // Get session using better-auth
    const session = await auth.api.getSession({
      headers: headersList,
    });

    // Add cache headers for client-side caching
    const response = new Response(
      JSON.stringify({
        user: session?.user || null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // Cache for 5 minutes on client
          "Cache-Control": "private, max-age=300",
          // Allow stale data while revalidating
          "Vary": "Cookie",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Session fetch error:", error);
    
    return new Response(
      JSON.stringify({
        user: null,
        error: "Failed to fetch session",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
