"use client";
import ActionCard from "@/components/ActionCard";
import { useUserRole } from "@/components/hooks/useUserRole";
import { QUICK_ACTIONS } from "@/constants";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Loader2Icon } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";

export default function Home() {
  const router= useRouter();
  const { isInterviewer, isLoading} = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const joinInterviewAction = QUICK_ACTIONS.find(action => action.title === "Join Interview");


  const [showModal, setShowModal]= useState(false);
  const [modalType, setModalType]= useState<"start" | "join">();


  const handleQuickAction = (title: string )=>{
    switch(title){
      case "New Call":
        setShowModal(true);
        setModalType("start");
        break;
      
      case "Join Interview":
        setShowModal(true);
        setModalType("join");
        break;
      default:
        router.push(`/${title.toLowerCase()}`);

    }
  };

  if(isLoading){
    <LoaderUI/>
  }


  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* welcome Section */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text
        text-transparent">
          Welcome Back!!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer ?
            "Mange your interviews and review the candidates effectively"
          : "Access your upcoming interviews and preparations"}

        </p>

      </div>

      {
        isInterviewer ? (
          <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            { QUICK_ACTIONS.map((action)=>(
              <ActionCard 
                key={action.title}
                action={action}        
                onClick= { () => handleQuickAction(action.title)}      
              />
            ))
            }
          </div>

          <MeetingModal
             isOpen={showModal}
             onClose = { () => setShowModal(false)}
             title= {modalType==="join"? "Join Meeting" : "Start Meeting"}
             isJoinMeeting = {modalType=== "join"}
            />
          </>
        ) : (
          <>
          <div>
            {joinInterviewAction && (
                <div className="mt-5">
                  <p className="ml-2 mb-2 font-bold">Instant Meeting</p>
                    <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-6">
                      <ActionCard
                        key={joinInterviewAction.title}
                        action={joinInterviewAction}
                        onClick={() => handleQuickAction(joinInterviewAction.title)}
                      />
                      <MeetingModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
                        isJoinMeeting={modalType === "join"}
                      />
                    </div>
                  </div>
                  )}
                  <h1 className="text-3xl font-bold mt-6">
              Yours Interviews
            </h1>
            <p className="text-muted-foreground mt-1">
              View and join your Scheduled Interviews
            </p>
          </div>
          <div className="mt-8 ">
            {
              interviews === undefined ? (
                <div className="flex justify-center py-12">
                  <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>

              ) : interviews.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {
                    interviews.map((interview) => (
                      <MeetingCard key={interview._id} interview={interview} /> 
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  You have No Scheduled Interviews
                </div>
              )
            }
          </div>
          </>
        )
      }
    </div>
  );
}
