import { Image, ImageKitProvider } from '@imagekit/next';

export default function Page() {
  return (
    <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT as string}>
      <Image
        src="/profile.png"
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </ImageKitProvider>
  )
}
