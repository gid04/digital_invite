import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  invitees: defineTable({
    civility: v.string(), // "M" or "Mme"
    nom: v.string(),
    prenoms: v.string(),
    withPlusOne: v.boolean(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
