import z from "zod";

export const postSchema = z.object({
    title: z.string().min(3).max(80),
    content: z.string().min(10).max(500),
    image: z.instanceof(File)
})