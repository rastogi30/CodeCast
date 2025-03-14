import { httpRouter } from "convex/server";
import {httpAction} from "./_generated/server";
import {WebhookEvent} from "@clerk/nextjs/server";
import {Webhook} from "svix";
import {api} from "./_generated/api";

const http= httpRouter();

http.route({
    path:"/clerk-webhook",
    method:"POST",
    handler: httpAction(async (ctx, request)=>{
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if(!webhookSecret){
            console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable") 
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if(!svix_id || !svix_signature || !svix_timestamp){
            console.error("Missing required Svix headers:", { svix_id, svix_signature, svix_timestamp });
            return new Response("Missing required Svix headers", {
                status:400,
            });
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        // create an instance
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try{
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp,
            }) as WebhookEvent;
        }
        catch(error){
            console.error("Error verifying webhook:", error);
            return new Response("Error verifying webhook signature", {
                status:400,
            })
        }

        const eventType = evt.type;
        console.log("Received webhook event:", eventType);

        if(eventType === "user.created"){
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;

            if (!email_addresses || email_addresses.length === 0) {
                console.error("No email address found in webhook data");
                return new Response("Invalid user data", { status: 400 });
            }

            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            try {
                const result = await ctx.runMutation(api.users.syncUser, {
                    clerkId: id,
                    email,
                    name,
                    image: image_url,
                });
                console.log("Successfully synced user:", { id, email, name });
                return new Response(JSON.stringify({ success: true, userId: result }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            } catch (error) {
                console.error("Error creating user:", error);
                return new Response("Error creating user", {
                    status: 500,
                });
            }
        }
        
        return new Response("Webhook processed successfully", {
            status:200
        });
    })
})

export default http;
