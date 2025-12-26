import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { fetchQuery } from "convex/nextjs"
import { Suspense } from "react"
import Loading  from "@/app/(user)/blog/load"

export const dynamic = "force-dynamic";
export const revalidate = 30

export default function BlogPage() {
    return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      {/* Header */}
        <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
            Blog Articles
        </h1>
        <Separator className="mt-3" />
        
        </header>
        <Suspense fallback={<Loading/>}> 
        <LoadAllBlogs/>
        </Suspense>
    </div>
  )
}

async function LoadAllBlogs(){
    const posts = await fetchQuery(api.posts.getPosts)
    return (
        <>
        {/* Posts */}
      <section
        className="grid gap-6 sm:grid-cols-3"
      >
        {/* Loading Skeletons */}

        {/* Empty State */}
        {posts?.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No posts yet. The shelf is waiting for its first story.
          </p>
        )}

        {/* Post Cards */}
        {posts?.map(post => {
          const fallbackImg = `https://api.dicebear.com/9.x/shapes/png?seed=${encodeURIComponent(
            post.title || "post"
          )}`

          return (
            <Card
              key={post._id}
              className="pt-0 rounded-2xl overflow-hidden border bg-muted/10 hover:bg-muted/30 transition-all"
            >
              {/* Image */}
              <div className="relative h-36 md:h-40 w-full border-b">
                <Image
                  src={post.imageUrl ?? fallbackImg}
                  alt={`${post.title} cover image`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Title */}
              <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-tight line-clamp-2">
                    <Link href={`/blog/${post._id}`}>
                  {post.title}
                    </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-1">{post.content}</p>
              </CardContent>
              <CardFooter>
                <Link className={buttonVariants({
                    className: "w-full"
                })} href={`/blog/${post._id}`}>
                Read More
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </section>
        </>
    )
}
