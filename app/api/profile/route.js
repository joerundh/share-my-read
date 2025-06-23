import { auth } from "@clerk/nextjs/dist/types/server";
import { redirect } from "next/dist/server/api-utils";


/*==========================================================================
------------------------------------POST------------------------------------
==========================================================================*/

export async function POST(request, response) {
    /*

    */


}

/*==========================================================================
------------------------------------GET-------------------------------------
==========================================================================*/

export async function GET(request, response) {
    /*
    Fetches the user profile information of some user. A user ID is required
    in the request.

    If the client is not logged in, they may not view the profile of anyone

    If the client is logged in, they may view the profile if the profile is
    set to public, otherwise they will not have access

    If the client has gone through the trouble of typing in their own user ID
    into the URL bar after /user, they will be redirected to /user, without any
    user ID inserted, to view their own profile.
    */

    const { viewerId } = await auth();
    if (!viewerId) {
        response.status(401);
        return;
    }

    const { userId } = request.body;
    if (!userId) {
        // If the request doesn't have a user ID property, 400 is invoked.
        response.status(400);
        return;
    }
    if (viewerId === userId) {
        // If the user is trying to access their own profile, redirect to /user
        redirect(response, 200, "/user");
        return;
    }

    /*
    This point is reached if the user is logged in, the request object has a user ID
    property, and that user ID is different from that of the user trying to access 
    the profile.
    */

    const dataset = "production";
    const apiUrl = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/${process.env.SANITY_API_VERSION}/data/query/${dataset}`;
    const query = `*[_type == "profile" && userId = ${userId}] {
        userId,
        firstName,
        lastName,
        description,
        bookshelves,
        reviews,
        isPublic
    }`;

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            query: query
        });
        if (!res.ok) {
            // Some
            throw new Error("An error occurred")
        }

        const obj = await res.json();
        if (!obj.result) {
            // No profile was found
            response.status(404);
            return;
        }
        
        response.body["profile"] = obj["result"];
        response.status(200);
    }
    catch(e) {
        response.status(500);
        return;
    }
}



/*==========================================================================
-----------------------------------PATCH------------------------------------
==========================================================================*/

export async function PATCH(request, response) {
    /*

    */
    
}


/*==========================================================================
-----------------------------------DELETE-----------------------------------
==========================================================================*/

export async function DELETE(request, response) {
    /*

    */
}