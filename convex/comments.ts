import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

export const createComment = mutation({
  args: { postId: v.id("posts"), content: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("You need to be Authenticated")
    return await ctx.db.insert("comments", { 
        postId: args.postId,
        content: args.content,
        authorId: user._id,
        authorName: user.name,
    });
  },
});

export const getComments = query({
  args: {
    postId: v.id("posts")
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q)=> q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();
    return comments;
  },
});


// export const generateUploadUrl = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const user = await authComponent.safeGetAuthUser(ctx);
//     if (!user) throw new ConvexError("You need to be Authenticated")
//     return await ctx.storage.generateUploadUrl();
// }});


// export const getPostById = query({
//   args: { postId: v.id("posts") },
//   handler: async (ctx, args) => {
//     const post = await ctx.db.get("posts", args.postId)
//     if (!post) return null;
//     const imageUrl = post.imageStorageId !== undefined
//           ? await ctx.storage.getUrl(post.imageStorageId)
//           : null;
//     return {
//       ...post,
//       imageUrl
//     };
//   },
// })