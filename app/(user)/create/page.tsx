"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { postSchema } from "@/schemas/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { toast } from "sonner"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createBlogAction } from "@/app/actions"

type PostFormValues = z.infer<typeof postSchema>

export default function CreatePage() {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { control, handleSubmit, formState } = form
  const { isSubmitting, errors } = formState

  async function onSubmit(data: PostFormValues) {
    startTransition (async ()=>{
        // const createPost = useMutation(api.posts.createPost)
        // createPost(data) //using client side
        await createBlogAction(data)
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create a new post
          </h1>
          <p className="text-muted-foreground">
            Draft something thoughtful. You can always refine it later.
          </p>
        </div>

        {/* Main Editor Card */}
        <Card className="shadow-sm border-muted/40">
          <CardHeader>
            <CardTitle className="text-l">Post details</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup className="space-y-5">

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xl font-medium">
                    Title
                  </label>

                  <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        placeholder="Give your post a meaningful headline"
                        aria-invalid={fieldState.invalid}
                        className="h-11"
                        {...field}
                      />
                    )}
                  />

                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-xl font-medium">
                    Content
                  </label>

                  <Controller
                    name="content"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Textarea
                        rows={10}
                        placeholder="Where your thoughts unfold..."
                        aria-invalid={fieldState.invalid}
                        className="resize-none leading-relaxed"
                        {...field}
                      />
                    )}
                  />

                  {errors.content && (
                    <p className="text-sm text-destructive">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <label className="text-xl font-medium">
                    Upload an Image
                  </label>

                  <Controller
                    name="image"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event)=>{
                            const file = event.target.files?.[0]
                            field.onChange(file)
                        }}
                        placeholder="Upload"
                      />
                    )}
                  />

                  {errors.content && (
                    <p className="text-sm text-destructive">
                      {errors.content.message}
                    </p>
                  )}
                </div>
              </FieldGroup>

              {/* Action Area */}
              <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                >{isPending ? 
                <>
                    <Loader2 className="animate-spin size-4" />
                    <span>Loading...</span>
                </>
                :   <span>Publish Draft</span>
                }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
