'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {

  return (
    <main className={cn("min-h-screen w-screen flex flex-col justify-center text-spotify-main place-items-center lg:p-0 p-6")}>

      <div>
        <h1 className="text-4xl text-white font-bold">Spotify <span className="text-spotify-green">Boxed</span></h1>
        <p className="text-spotify-text">There&apos;s two versions. A long process and an even longer process.</p>
        <p className="text-spotify-text mt-4">To get started, click on either of the two buttons at the bottom and read the instructions.</p>
        <div className="flex w-full mt-4 gap-4">
          <Link className=" bg-white p-4 rounded-xl grow text-black text-center" href="/normal">Normal</Link>
          <Link className=" bg-white p-4 rounded-xl grow text-black text-center" href="/extended">Extended</Link>

        </div>
      </div>
    </main>
  );
}
