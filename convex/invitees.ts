import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createInvitee = mutation({
  args: {
    civility: v.string(),
    nom: v.string(),
    prenoms: v.string(),
    withPlusOne: v.boolean(),
  },
  handler: async (ctx, args) => {
    const inviteeId = await ctx.db.insert("invitees", {
      civility: args.civility.trim(),
      nom: args.nom.trim(),
      prenoms: args.prenoms.trim(),
      withPlusOne: args.withPlusOne,
      createdAt: Date.now(),
    });
    return inviteeId;
  },
});

export const listInvitees = query({
  args: {},
  handler: async (ctx) => {
    const invitees = await ctx.db
      .query("invitees")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    return invitees;
  },
});
