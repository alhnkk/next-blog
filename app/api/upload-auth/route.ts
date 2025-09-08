import { getUploadAuthParams } from "@imagekit/next/server"
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Your application logic to authenticate the user
    // For example, you can check if the user is logged in or has the necessary permissions
    // If the user is not authenticated, you can return an error response

    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
      // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
      // token: "random-token", // Optional, a unique token for request
    })

    return NextResponse.json({ 
      token, 
      expire, 
      signature, 
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY 
    })
  } catch (error) {
    console.error('Upload auth error:', error)
    return NextResponse.json(
      { error: 'Upload authentication failed' },
      { status: 500 }
    )
  }
}
