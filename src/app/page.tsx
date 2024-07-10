'use client'

import { SpotifyData } from "@/types/types";
import Image from "next/image";
import { useState } from "react";
import FileInput from "@/components/fileInput";
import { cn } from "@/lib/utils";
import StatBox from "@/components/statBox";
import Leaderboard from "@/components/leaderboard";
import BlurFade from "@/components/fadeIn";



export default function Home() {

  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<SpotifyData>();
  const [time, setTime] = useState('thisYear')
  const [spotifyStats, setSpotifyStats] = useState<SpotifyData['current'] | SpotifyData['allTime']>()
  const [seeDemo, setSeeDemo] = useState(false)

  const handleTimeChange = () => {
    setTime(time === 'thisYear' ? 'allTime' : 'thisYear');
    setSpotifyStats(time === 'thisYear' ? stats!.allTime : stats!.current);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("demo", seeDemo ? "true" : "false")

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json();
    setStats(data)
    setSpotifyStats(data.current)
  }

  return (
    <main className={cn("bg-spotify-bg h-screen w-screen flex justify-center", `${stats ? '' : " items-center"}`)}>
      {
        stats ? (
          <div className="w-full flex flex-col">
            <div className="w-full h-[20rem] bg-gradient-to-t from-spotify-header-bottom to-spotify-header-top flex items-center pl-20 gap-8">
              <Image src={stats.user.imageUrl} alt="user" width={250} height={250} className="shadow-2xl rounded-full" />
              <h1 className="text-white text-8xl font-extrabold">{stats.user.displayName}</h1>
            </div>
            <div className="flex text-white pl-40 gap-8 text-xl">
              <p onClick={handleTimeChange} className={cn("pt-20 hover:underline decoration-spotify-green underline-offset-8 cursor-pointer", time === "thisYear" ? "underline" : "")}>This Year</p>
              <p onClick={handleTimeChange} className={cn("pt-20 hover:underline decoration-spotify-green underline-offset-8 cursor-pointer", time === "allTime" ? "underline" : "")}>All Time</p>
            </div>
            <div className="w-full flex pt-12 pl-40 gap-8">
              <div className="w-10/12  flex flex-col gap-20">
                <div className="flex gap-4 flex-col">
                  <h2 className="text-4xl text-white font-bold">Pure Numbers</h2>
                  <div className="flex gap-4">
                    {
                      [spotifyStats!.daysPlayed, spotifyStats!.hoursPlayed, spotifyStats!.minutesPlayed, spotifyStats!.songs].map((stat, i) => {
                        return (
                          <StatBox key={i} title={["Days Played", "Hours Played", "Minutes Played", "Songs Played"][i]} stat={stat} />
                        )
                      })
                    }
                  </div>
                </div>

                <div className="flex gap-4 flex-col max-w-full">
                  <h2 className="text-4xl text-white font-bold pb-4">Top Stats</h2>
                  <div className="flex gap-8">
                    <BlurFade className="w-1/3" delay={.25}><Leaderboard title="Top Artists" measures="Plays" data={spotifyStats!.artistAppearances} /></BlurFade>
                    <BlurFade className="w-1/3" delay={.5}><Leaderboard title="Top Songs" measures="Plays" data={spotifyStats!.songAppearances} /></BlurFade>
                    <BlurFade className="w-1/3" delay={.75}><Leaderboard title="Artists By the Numbers" measures="Plays" data={Object.fromEntries(spotifyStats!.minutesPerArtist.map(c => [c.artist, c.minutes]))} /></BlurFade>
                  </div>

                </div>
              </div>
            </div>

          </div>

        ) : (
          <BlurFade delay={.15} inView className="w-1/3">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-full ">
              <label className="flex flex-col items-center justify-center w-full">
                <span className="text-5xl font-bold text-white">Spotify Boxed</span>

                <FileInput setFile={setFile} fileName={file!} />
              </label>
              <p onClick={() => setSeeDemo(!seeDemo)} className={cn(`p-2 rounded-lg w-full mt-4 text-center hover:cursor-pointer`, seeDemo ? "text-white bg-blue-400" : "text-black bg-white hover:bg-opacity-90")}>Toggle Demo Mode</p>

              <button type="submit" className="bg-spotify-green text-white p-2 rounded-lg mt-2 w-full hover:bg-green-600">Submit</button>
              <div className="text-spotify-text pt-4 flex flex-col justify-start w-full">
                <p className="text-lg font-semibold text-spotify-main">Instructions:</p>
                <p className="text-lg">1. Go to your Spotify account on the website</p>
                <p className="text-lg">2. Click on your profile icon on the top right and click &quot;Account&quot;</p>
                <p className="text-lg">3. Scroll down to the &quot;Security and Privacy&quot; and click &quot;Privacy settings&quot; </p>
                <p className="text-lg">4. Scroll down to &quot;Download your data&quot; and tick the checkbox under &quot;Extended streaming services&quot; </p>
                <p className="text-lg">5. Click &quot;Request data&quot; and click on &quot;CONFIRM&quot; in the email spotify sends you</p>
                <p className="text-lg">6. Wait a few days for the email containing your data and press download.</p>
                <p className="text-lg">7. Upload the zip file here and enjoy :) </p>

                  <p className="text-lg text-white pt-4">We do <span className="underline">not</span> store your data. The file uploaded is only temporary within our systems and is immediately deleted after retrieving necessary data. </p>

              </div>
            </form>
          </BlurFade>

        )
      }


    </main>
  );
}
