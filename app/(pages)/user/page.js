import { useUser } from "@clerk/nextjs";

/*
This page is only seen if the user is logged in
*/

export default function Page() {
    // Fetch and display the logged-in user's profile 

    return (
        <>
            <h2>My profile</h2>
        </>
    )
}