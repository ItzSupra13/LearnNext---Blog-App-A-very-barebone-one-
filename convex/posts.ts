import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

export const createPost = mutation({
  args: { title: v.string(), content: v.string(), imageStorageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("You need to be Authenticated")
    const blogArticle = await ctx.db.insert("posts", { 
        title: args.title, 
        content: args.content, 
        authorId: user._id,
        imageStorageId: args.imageStorageId,
    });
    return blogArticle;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .collect();

    return Promise.all(
      posts.map(async (post) => {
        const imageUrl = post.imageStorageId
          ? await ctx.storage.getUrl(post.imageStorageId)
          : null;

        return {
          ...post,
          imageUrl
        };
      })
    );
  },
});


export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("You need to be Authenticated")
    return await ctx.storage.generateUploadUrl();
}});


export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get("posts", args.postId)
    if (!post) return null;
    const imageUrl = post.imageStorageId !== undefined
          ? await ctx.storage.getUrl(post.imageStorageId)
          : null;
    return {
      ...post,
      imageUrl
    };
  },
})

interface searchResultType {
  _id: string,
  title: string,
  content: string
}

export const searchPosts = query({
  args: { searching: v.string(), limit: v.number() },
  handler: async (ctx, args) => {
    const limit = args.limit;
    const results: Array<searchResultType> = [];
    const seen = new Set();
    const pushDocs = async (docs: Array<Doc<"posts">>) => {
      for (const doc of docs){
        if (seen.has(doc._id)) continue;
        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          content: doc.content
        })
        if (results.length>=limit) break;
      }
    }
    const titleMatches = await ctx.db.query("posts")
    .withSearchIndex("search_title", 
      (q)=> q.search("title", args.searching))
    .take(limit)

    await pushDocs(titleMatches);

    if(results.length<limit){
      const bodyMatches = await ctx.db.query("posts").withSearchIndex("search_content", (q)=> q.search("content", args.searching)).take(limit)
      await pushDocs(bodyMatches)
    }
    return results;
  }
})