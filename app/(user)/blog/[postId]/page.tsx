"use server"

import { api } from "@/convex/_generated/api"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"
import { CommentSection } from "@/components/web/CommentSection"
import { Presence } from "@/components/web/Presence"
import { getToken } from "@/lib/auth-server"
type PostPageProps = {
  params: Promise<{ postId: Id<"posts"> }>
}

export default async function PostIdRoute({ params }: PostPageProps) {
  const { postId } = await params

  // Parallel queries (which do not depend on each other)
  const token = await getToken();
  const [post, preloadedComments, userId] = 
        await Promise.all([await fetchQuery(api.posts.getPostById, {postId,}), 
        await preloadQuery(api.comments.getComments, {postId}), await fetchQuery(api.presence.getUserId, {}, {token})])

  //Sequential queries

//   const post = await fetchQuery(api.posts.getPostById, {
//     postId,
//   })
//   const preloadedComments = await preloadQuery(api.comments.getComments, {postId})


  if (!post) return notFound()

  const fallbackImg = `https://api.dicebear.com/9.x/shapes/png?seed=${encodeURIComponent(
    post.title || "post"
  )}`

  return (
    <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto">

      {/* Back Nav */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            ← Back to Blog
          </Link>
        </Button>
        <Presence roomId={postId} userId={userId}/>
      </div>

      {/* Article Shell */}
      <Card className="rounded-3xl overflow-hidden border bg-background shadow-sm">

        {/* Hero Section */}
        <div className="relative h-72 md:h-96">
          <Image
            src={post.imageUrl ?? fallbackImg}
            alt={`${post.title} image`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Soft overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent" />

          {/* Title over hero */}
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight backdrop-blur-sm bg-background/60 px-3 py-2 rounded-xl shadow">
              {post.title}
            </h1>
          </div>
        </div>

        <Separator />

        {/* Body */}
        <CardContent className="pb-10">
          <article className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed text-[15px]">
            <p className="whitespace-pre-line text-xl">
              {post.content}
            </p>
          </article>
        </CardContent>
      <Separator/>
      <CommentSection preloadedComments={preloadedComments}/>
      </Card>
    </div>
  )
}

