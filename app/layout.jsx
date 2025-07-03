import { Geist, Geist_Mono, MonteCarlo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LoginBar from "@/app/components/ui/LoginBar";
import NavBar from "@/app/components/ui/NavBar";
import QueryProvider from "./components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const monteCarlo = MonteCarlo({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Share My Read",
  description: "Browse books, and leave reviews and ratings for others to read."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <QueryProvider>
            <header className={"bg-[rgba(0, 0, 0, 0.7)]"}>
              <nav className={"text-sm bg-white w-full flex flex-row justify-between align-stretch p-2"}>
                <NavBar />
                <LoginBar />
              </nav>
            </header>
            <div className={"w-full h-40 bg-[rgba(0,0,0,0.4)] flex flex-col justify-center"}>
              <h1 className={`w-[90%] mx-auto ${monteCarlo.className} text-white text-4xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}>Share my Read</h1>
            </div>
            <main className={"p-5 bg-white"}>
              {children}
            </main>
            <footer className={"flex flex-row justify-center align-center p-2 bg-white border-t border-t-black"}>
              <p>2025 No rights reserved</p>
            </footer>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
