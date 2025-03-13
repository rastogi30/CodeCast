"use client";

import { useUserRole } from "@/components/hooks/useUserRole";
import LoaderUI from "@/components/LoaderUI";
import { useRouter } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";


function SchedulePage() {
  const router = useRouter();
  const {isInterviewer , isLoading }= useUserRole();

  if(isLoading) return <LoaderUI />
  if(!isInterviewer) return router.push("/");


    return (
      <InterviewScheduleUI />
    )
  }
  
  export default SchedulePage