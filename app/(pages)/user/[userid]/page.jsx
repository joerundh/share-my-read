"use client"
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { QueryClient } from "@tanstack/react-query";

export default function Page({ params }) {
    /*
    Get user profile from Clerk
    */
    const { userSignedIn: isSignedIn, userId, userLoading: isLoading } = useUser();

    /*
    If the user is not signed in, the user may not view the user profile
    */

    if (!isSignedIn) {
        return (
            <>
                <h2>No access</h2>
                <p>Login to view this user profile.</p>
            </>
        )
    }
    
    /*
    Otherwise, go right ahead
    */

    const [ viewingId, setViewingId ] = useState("");
    const [ profile, setProfile ] = useState(null);

    const queryClient = new QueryClient();

    useEffect(async () => {
        const { userid } = await params;
        setViewingId(userid);

        queryClient.prefetchQuery({
            queryKey: [ "profile", viewingId ],
            queryFn: async () => {
                const request = {
                    header: {
                        method: "GET",
                    }
                }

                const res = await fetch("");
                if (!res.ok) {
                    throw new Error("Could not get user profile");
                }

                return await res.json();
            },
            enabled: !!viewingId
        });
    }, [ viewingId ]);

    if (isLoading) {
        return (
            <h2>Loading...</h2>
        )
    }

    return (
        <>
            <h2>This is the user profile of {viewingId}</h2> 
        </>
    )
}