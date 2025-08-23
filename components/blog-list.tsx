import {
    Calendar,
  } from "lucide-react";
  
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const BlogList = () => {
  return (
    <div className="mt-4 space-y-12">
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <Card
        key={i}
        className="flex flex-col sm:flex-row shadow-none overflow-hidden rounded-md border-none bg-transparent"
        >
        <Image src="/placeholder.jpeg" alt="image" width={536} height={302} className="w-[536px] h-[302px] object-cover rounded-sm" />
        <CardContent className="px-0 py-0 flex flex-col max-w-xl">

          <div className="flex items-start gap-6 mt-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Ağustos 23, 2025
            </div>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight my-5">
            A beginner&apos;s guide to blackchain for engineers
          </h3>
          <p className="mt-2 text-muted-foreground line-clamp-2 text-ellipsis mr-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa
            consequatur minus dicta accusantium quos, ratione suscipit id
            adipisci voluptatibus. Nulla sint repudiandae fugiat tenetur
            dolores.
          </p>

        </CardContent>
      </Card>
    ))}
  </div>
  )
}

export default BlogList