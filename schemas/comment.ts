import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const commentSchema = z.object({
    content: z.string(),
    postId: z.custom<Id<"posts">>()
})
