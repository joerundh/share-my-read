"use client"
import { useUser, SignedIn, SignedOut, SignUpButton, SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginBar() {
    const { userId } = useUser();

    return (
        <div className={"flex flex-row justify-between align-center gap-5"}>
            <SignedIn>
                <Link href={`/user/${userId}`}><button className={"p-2"}>My profile</button></Link>
                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <SignInButton>
                    <button className={"cursor-pointer p-2"}>Sign in</button>
                </SignInButton>
                <SignUpButton></SignUpButton>
            </SignedOut>
        </div>
    )
}