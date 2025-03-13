import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";


export const useUserRole = ()=>{
    const {user}= useUser(); 
    // this way we call the hook pass the api with related table as well as query
    const userData= useQuery(api.users.getUserbyClerkId,{
        clerkId: user?.id || "" // userid de do agar nhi h to empty string dedi
    })
    // userData...conver return you null means nothing is there is undefined means loading state or otherwise give the data

    const isLoading= userData=== undefined;

    return{
        isLoading,
        isInterviewer: userData?.role === "interviewer",
        isCandidate: userData?.role === "candidate",
    };

}