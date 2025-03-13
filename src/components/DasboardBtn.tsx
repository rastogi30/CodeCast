"use client"

import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useUserRole } from "./hooks/useUserRole";

function DasboardBtn() {

    // not take as thi hard coded so use hooks to get this from backend
    // const isCandidate= false
    // const isInterviewer= true
    const {isCandidate, isLoading} = useUserRole();

    if(isCandidate || isLoading) return null;

  return (
   <Link href={"/Dashboard"}>
    <Button className="gap-2 font-bold" size={"sm"}>
        <SparklesIcon className="sixe-4"/>
        DashBoard
    </Button>
  </Link>
  )
}

export default DasboardBtn