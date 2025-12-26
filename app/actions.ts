"use server"

import { postSchema } from "@/schemas/blog"
import z from "zod"
import { api } from "@/convex/_generated/api";
import { fetchMutation} from "convex/nextjs";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

type PostFormValues = z.infer<typeof postSchema>

export async function createBlogAction(data: PostFormValues){
    const parsed = postSchema.safeParse(data)
    if (!parsed.success) throw new Error("Something Went Wrong")

    const token = await getToken()
    const imgUrl = await fetchMutation(api.posts.generateUploadUrl, {} , {token}) //gets the url
    const result = await fetch(imgUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image!.type },
      body: parsed.data.image,
    });
    if (!result.ok) throw new Error("Failed uploading file")
    const { storageId } = await result.json();
    await fetchMutation(api.posts.createPost, {
        title: parsed.data.title, 
        content: parsed.data.content,
        imageStorageId: storageId
        }, {token})
    console.log("Using server")
    revalidatePath("/blog")
    return redirect("/blog")
}