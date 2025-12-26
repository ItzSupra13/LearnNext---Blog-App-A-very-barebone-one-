"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { commentSchema } from "@/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { useTransition } from "react";
import { toast } from "sonner";

type CommentFormValues = z.infer<typeof commentSchema>;

export function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getComments>;
}) {
    const { postId } = useParams<{postId: Id<"posts">}>()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId: postId,   
      content: "",
    },
  });

  const createcomment = useMutation(api.comments.createComment);
  const [isPending, startTransition] = useTransition();
  const data = usePreloadedQuery(props.preloadedComments);

  const onSubmit = async (values: CommentFormValues) => {
    startTransition(async ()=>{
        try {
            await createcomment(values)
            toast.success("Comment posted!")
          reset({ ...values, content: "" });
        } catch (err) {
            throw new Error("Failed to create comment")
        }
    })
  };

  function timeAgo(date: Date | number | string) {
  const now = new Date()
  const past = new Date(date)
  const diff = (now.getTime() - past.getTime()) / 1000 // seconds

  if (diff < 60) return `${Math.floor(diff)} sec ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`

  return past.toLocaleDateString()
}


  return (
    <Card className="w-full border rounded-2xl">
      <CardHeader className="flex flex-row items-center gap-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{data?.length} Comments</h3>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6 pt-6">
        {/* Add Comment Box */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts..."
            className="min-h-[90px]"
            {...register("content")}
          />

          {errors.content && (
            <p className="text-xs text-red-500">
              {errors.content?.message}
            </p>
          )}

          <div className="flex justify-end">
            <Button
                type="submit"
                className="w-full"
                disabled={isPending}>
                    {isPending ? 
                            <>
                                <Loader2 className="animate-spin size-4" />
                                <span>Posting...</span>
                            </>
                            :   <span>Post</span>
                            }
                            </Button>
          </div>
        </form>

        <Separator />

        {/* Static Preview Comments (Fetching later) */}
        
        <div className="space-y-5 opacity-90">
        {data?.map(comment => (
  <div
    key={comment._id}
    className="flex gap-3 w-full"
  >
    <Avatar>
      <AvatarFallback>{comment.authorName?.[0]}</AvatarFallback>
    </Avatar>

    <div className="flex-1 space-y-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium truncate">
          {comment.authorName}
        </p>

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {timeAgo(comment._creationTime)}
        </span>
      </div>

      <p className="text-sm text-muted-foreground break-words line-clamp-3">
        {comment.content}
      </p>
    </div>
  </div>
))}

        </div>
      </CardContent>
    </Card>
  );
}
