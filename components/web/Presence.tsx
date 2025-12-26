"use client"

import { api } from "@/convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { Id } from "@/convex/_generated/dataModel";

interface inProps{
    roomId: Id<"posts">,
    userId: string,
}

export function Presence({roomId, userId} : inProps) {
    const presenceState = usePresence(api.presence, roomId , userId);
    if (!presenceState || presenceState.length==0){
        return null
    }
    return (
        <>
            <main className="flex items-center gap-2 mt-2">
                <FacePile presenceState={presenceState ?? []} />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{presenceState.length} Viewing now</p>
            </main>
        </>
    )
}