import { auth, createClerkClient } from "@clerk/nextjs/server";
import { client } from "./lib/sanity";
import ReviewListItem from "./components/ui/ReviewListItem";

export default async function Home() {
  const { userId: clientId } = await auth();

  if (!clientId) {
    return (
      <>
        <h2 className={"text-lg font-bold"}>You are not logged in</h2>
        <p>Log in to see and read all reviews.</p>
      </>
    )
  }

  // Fetch reviews
  const reviews = await client.fetch(`*[_type == "review"] | order(_createdAt desc){
    bookId, userId, header, body, rating  
  }[0...10]`, { cache: "no-store" });

  // Fetch user information
  const userIds = reviews.map(obj => obj.userId);
  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const list = await clerkClient.users.getUserList({ userId: userIds });
  const users = list.data.map(user => {
    return { 
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      imageUrl: user.imageUrl
    };
  });

  // Fetch book information
  const bookIds = reviews.map(obj => obj.bookId);
  const res = await fetch(`https://gutendex.com/books?ids=${bookIds.join(",")}`);
  if (!res.ok) {
    return (
      <>
        <h2 className={"text-lg font-bold"}>An error occurred</h2>
        <p>Could not get the latest reviews, try again later.</p>
      </>
    )
  }
  const object = await res.json();
  const books = object.results.map(book => {
    return {
      id: `${book.id}`,
      title: book.title,
      authors: book.authors.map(author => author.name.split(", ").reverse().join(" ")),
      imageUrl: book.formats["image/jpeg"]
    };
  });

  // Combine
  const latest = reviews.map(review => {
    const user = users.find(obj => obj.id === review.userId);
    const book = books.find(obj => obj.id === review.bookId);
    return {
      book: book,
      user: user,
      header: review.header,
      body: review.body,
      rating: review.rating
    }
  })

  return (
    <>
      <h2 className={"text-lg font-bold text-center"}>Latest reviews</h2>
      <div className={"p-3 flex flex-col gap-3"}>
        {
          latest.map((review, index) => <ReviewListItem reviewObject={review} key={index} />)
        }
      </div>
    </>
  );
}
