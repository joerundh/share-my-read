"use client"
import { useUser, SignedIn, SignedOut, SignUpButton, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function LoginBar() {
    const { userId } = useUser();
    console.log(userId)

    return (
        <div className={"h-full flex flex-row justify-between align-center gap-5"}>
            <SignedIn>

                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <SignInButton />
                <SignUpButton />
            </SignedOut>
        </div>
    )
}