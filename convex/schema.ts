import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  }).searchIndex("search_title", {
    searchField: "title",
  }).searchIndex("search_content", {
    searchField: "content"
  }),
  comments: defineTable({
    postId: v.id("posts"),          // which post this belongs to
    authorId: v.string(),
    authorName: v.string(),           // user who commented
    content: v.string(),            // comment body
  })
});