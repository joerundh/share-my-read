import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/dist/types/server";

async function clientIsAuthorized(userId, adminAuthorized=false) {
    const { userId: clientId, userRole: clientRole } = await auth();

    if (!userId) {
        // The viewer is not logged in, and is thus denied
        return false;
    }
    if (clientId === userId || (adminAuthorized && clientRole === "admin")) {
        return true;
    }
    return false;
}

async function clientIsLoggedIn() {
    const { userId } = await auth();
    return !!userId;
}

/*==========================================================================
------------------------------------POST------------------------------------
==========================================================================*/

export async function POST(request) {
    /*
    Invoked when a user posts a review of a book.
    */
    if (!clientIsLoggedIn()) {
        return Response.json({ message: "Access denied." }, { status: 401 })
    }

    const req = await request.body;
    if (!req.userId) {
        return Response.json({ message: "A user reference is required." }, { status: 400 });
    }
    if (!req.bookId) {
        return Response.json({ message: "A book reference is required." }, { status: 401 });
    }
    if (!req.header) {
        return Response.json({ message: "A header is required." }, { status: 401 });
    }
    if (clientId !== req.userId) {
        return Response.json({ message: "Mismatched user references." }, { status: 401 });
    }
    
    /*
    At this point, it is certain that the client is logged in and can post a review, 
    */

    try {
        const dataset = "production";
        const apiUrl = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/${process.env.SANITY_API_VERSION}/data/mutate/${dataset}`;
        const query = {
            mutations: [
                {
                    create: {
                        "_type": "review",
                        userId: req.userId,
                        bookId: req.bookId,
                        header: req.header,
                        body: req.body || undefined,
                        rating: req.rating || undefined
                    }
                }
            ]
        }
        const httpRequest = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SANITY_API_TOKEN}`
            },
            body: JSON.stringify(query)
        }

        const res = await fetch(apiUrl, httpRequest);
        if (!res.ok()) {
            throw new Error("An error occurred.");
        }
        const obj = await res.json();

        const result = obj.results[0];
        if (result.operation === "delete" && result.documentId === reviewId) {
            /*
            The review was successfully deleted, return 200
            */
            return Response.json({ message: "Action completed." });
        } else {
            /*
            Something went wrong in the other end, return 502
            */
            return Response.json({ message: "Action failed." }, { status: 502 });
        }
    }
    catch(e) {
        /*
        Some error occurred, return 500
        */
        return Response.json({ message: "Action failed." }, { status: 500 });
    }
}

/*==========================================================================
------------------------------------GET-------------------------------------
==========================================================================*/

export async function GET(request) {
    /*
    Fetches either all the reviews written by a user identified by their user ID,
    or all the reviews of a book identified by the book ID, or checks whether or not
    a user has written a review of a book
    */

    // Check if a user is logged in, and return 401 if not
    if (!clientIsLoggedIn()) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = await request.body;

    const sortString = n => {
        if (n === 1) {
            return "rating desc";
        } else if (n === 2) {
            return "rating asc";
        }
        return "_createdAt";
    }

    const offset = req.offset || 0;
    const limit = req.offset || 10;
    const sortBy = sortString(req.sortString);
    
    let query;
    if (req.userId) { 
        if (req.bookId) {
            // Check for a single review by a given user about a given book
            query = `*[_type == "review" && userId == "${req.userId}" && bookId == "${req.bookId}"] {
                _id,
                bookId,
                userId
            }`;
        } else {
            // Get all reviews written by a given user
            query = `*[_type == "review" && userId == "${req.userId}"] | order(${sortBy}) {
                _id,
                _createdAt,
                bookId,
                userId,
                header,
                body,
                rating
            }[${offset}...${offset + limit}]`;
        }
    } else {
        if (req.bookId) {
            // Get all reviews of a given book
            query = `*[_type == "review" && userId == "${req.userId}"] | order(${sortBy}) {
                _id,
                _createdAt,
                bookId,
                userId,
                header,
                body,
                rating
            }[${offset}...${offset + limit}]`;
        } else {
            // No reference of any kind is given, return 400
            return Response.json({ message: "Missing reference." }, { status: 400 })
        }
    }

    try {
        const data = await client.fetch(query, {
            cache: "no-store"
        });
        return Response.json({
            results: data
        });
    }
    catch (e) {
        return Response.json({ message: "Could not fetch data" }, { status: 502 })
    }
}



/*==========================================================================
-----------------------------------PATCH------------------------------------
==========================================================================*/

export async function PATCH(request) {
    /*
    Update some information related to a review, either the header or body
    was changed, or someone found it helpful, or they no longer found it 
    helpful
    */
    
    const req = await request.body;
    if (!req.userId) {
        return Response.json({ message: "A user reference is required." }, { status: 400 });
    }

    const { userId: clientId } = await auth();
    if (req.userId !== clientId) {
        return Response.json({ message: "Unauthorized to perform the action." }, { status: 401 })
    }

    if (!req.reviewId) {
        return Response.json({ message: "A reference is required." }, { status: 400 });
    }

    if (!req.newHeader && !req.newBody && !req.newRating && !addLike && !removeLike) {
        return Response.json({ message: "The action needs data to be specified." }, { status: 400 })
    }

    /*
    To come this far, the user needs to either be the same as the author of
    the review, or an administrator (as well as logged in, obviously).
    */

    try {
        const dataset = "production";
        const apiUrl = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/${process.env.SANITY_API_VERSION}/data/mutate/${dataset}`;

        const mutations = [];
        if (req.newHeader) {
            const mutation = {
                patch: {
                    "_id": req.reviewId,
                    set: {
                        header: req.newHeader
                    }
                }
            };
            mutations.push(mutation);
        }
        if (req.newBody) {
            const mutation = {
                patch: {
                    "_id": req.reviewId,
                    set: {
                        body: req.newBody
                    }
                }
            };
            mutations.push(mutation);
        }
        if (req.newRating) {
            const mutation = {
                patch: {
                    "_id": req.reviewId,
                    set: {
                        body: req.newRating
                    }
                }
            };
            mutations.push(mutation);
        }
        if (req.addLike) {
            const mutation = {
                patch: {
                    "_id": req.reviewId,
                    insert: {
                        after: "helpful[-1]",
                        items: [
                            req.userId
                        ]
                    }
                }
            };
            mutations.push(mutation);
        }
        if (req.removeLike) {
            const mutation = {
                patch: {
                    "_id": req.reviewId,
                    unset: [
                        `helpful[*] == "${req.userId}"`
                    ]
                }
            }
            mutations.push(mutation);
        }

        const query = {
            mutations: mutations
        };
        const httpRequest = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SANITY_API_TOKEN}`
            },
            body: JSON.stringify(query)
        }

        const res = await fetch(apiUrl, httpRequest);
        if (!res.ok()) {
            return Response.json({ message: "The action could not be performed." }, { status: 502 })
        }
        const obj = await res.json();

        const result = obj.results[0];
        if (result.operation === "delete" && result.documentId === reviewId) {
            /*
            The review was successfully deleted, return 200
            */
            return Response.json({ message: "Action completed." });
        } else {
            /*
            Something went wrong in the other end, return 502
            */
            return Response.json({ message: "The action could not be performed." }, { status: 502 });
        }
    }
    catch(e) {
        /*
        Some error occurred, return 500
        */
        return Response.json({ message: e.toString() }, { status: 500 });
    }
}


/*==========================================================================
-----------------------------------DELETE-----------------------------------
==========================================================================*/

export async function DELETE(request) {
    /*
    Delete a review, based on the review ID. In order for the deletion to go
    through, either the viewing user needs to be the same as the one that
    wrote the review, or the viewing user has to be an administrator.
    */

    const req = await request.body;
    
    if (!req.reviewId) {
        return Response.json({ message: "A reference is required." }, { status: 400 });
    }
    if (!req.userId) {
        return Response.json({ message: "A user reference is required." }, { status: 400 });
    }
    if (!(await clientIsAuthorized(req.userId, adminAuthorized=true))) {
        return Response.json({ message: "Not authorized to perform the requested action." }, { status: 401 })
    }

    /*
    To come this far, the user needs to either be the same as the author of
    the review, or an administrator (as well as logged in, obviously).
    */

    try {
        const dataset = "production";
        const apiUrl = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/${process.env.SANITY_API_VERSION}/data/mutate/${dataset}`;
        const query = {
            mutations: [
                {
                    delete: {
                        query: `[_type == "review" && _id == "${req.reviewId}"]`
                    }
                }
            ]
        }
        const httpRequest = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SANITY_API_TOKEN}`
            },
            body: JSON.stringify(query)
        }

        const res = await fetch(apiUrl, httpRequest);
        if (!res.ok()) {
            return Response.json({ message: "The action could not be performed." }, { status: 502 })
        }
        const obj = await res.json();

        const result = obj.results[0];
        if (result.operation === "delete" && result.documentId === reviewId) {
            /*
            The review was successfully deleted, return 200
            */
            return Response.json({ message: "Action completed." });
        } else {
            /*
            Something went wrong in the other end, return 502
            */
            return Response.json({ message: "The action could not be performed." }, { status: 502 });
        }
    }
    catch(e) {
        /*
        Some error occurred, return 500
        */
        return Response.json({ message: e.toString() }, { status: 500 });
    }
}