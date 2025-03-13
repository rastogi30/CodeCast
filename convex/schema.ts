import {defineSchema , defineTable} from "convex/server"
import {v} from "convex/values"
import { title } from "process";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        role: v.union(v.literal("candidate"), v.literal("interviewer")), // "candidate" or "interviewer""
        // this is important since we are use two differen services of two connect them how they know which table of whcih user 
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]),


    interviews: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.optional(v.number()),  // end time depend on  the interview when they want to end
        status: v.string(), // "in_progress" or "completed" or "failed" or "Upcoming"
        streamCallId: v.string(), // use to join interview
        candidateId: v.string(),  // which candidate we will have in this interview
        interviewerIds: v.array(v.string()), //we have multiple interviewers
    }).index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),


    comments: defineTable({
        content: v.string(),
        rating: v.number(), // 1 to 5 
        interviewerId: v.string(),
        interviewId: v.id("interviews"),
    }).index("by_interview_id", ["interviewId"]),
});

