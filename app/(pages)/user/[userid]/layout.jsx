"use client"
import { useUser } from "@clerk/nextjs";

export default function Layout({ children }) {
    const { userId } = useUser();

    if (!userId) {
        return (
            <>
                <h2 className={"center text-xl font-bold"}>You are not logged in</h2>
                <p>Sign up or login to see user profiles.</p>
            </>
        );
    }

    return (
        <>
            {children}
        </>
    );
}