import { Calendar } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

const BlogList = () => {
  return (
    <div className="mt-4 space-y-12">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Card
          key={i}
          className="grid grid-cols-7 shadow-none overflow-hidden rounded-md border-none bg-transparent gap-6"
        >
          <Link href="/post/1" className="col-span-3">
            <Image
              src="/placeholder.jpeg"
              alt="image"
              width={536}
              height={256}
              className="w-full h-[256px] object-cover rounded-[1px] brightness-110 contrast-105 saturate-110 hover:brightness-125 hover:contrast-110 transition-all duration-300 ease-in-out"
            />
          </Link>
          <CardContent className="col-span-4 px-0 py-0 flex flex-col">
            <div className="flex items-start gap-6 mt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> Ağustos 23, 2025
              </div>
            </div>

            <Link href="/post/1">
              <h3 className="mt-4 text-2xl font-semibold tracking-tight my-5">
                A beginner&apos;s guide to blackchain for engineers
              </h3>
            </Link>
            <p className="mt-2 text-muted-foreground line-clamp-2 text-ellipsis mr-4">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa consequatur minus dicta accusantium quos,
              ratione suscipit id adipisci voluptatibus. Nulla sint repudiandae fugiat tenetur dolores.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BlogList
