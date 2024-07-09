'use client'

import { SpotifyData } from "@/types/types";
import Image from "next/image";
import { useState } from "react";
import FileInput from "@/components/fileInput";
import { cn } from "@/lib/utils";
import StatBox from "@/components/statBox";

export default function Home() {

  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<SpotifyData>();
  const [time, setTime] = useState('thisYear')
  const [spotifyStats, setSpotifyStats] = useState<SpotifyData['current'] | SpotifyData['allTime']>()

  const handleTimeChange = () => {
    setTime(time === 'thisYear' ? 'allTime' : 'thisYear');
    setSpotifyStats(time === 'thisYear' ? stats!.allTime : stats!.current);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file!);

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
              <div className="w-3/4  flex flex-col gap-20">
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

                <div className="flex gap-4 flex-col">
                  <h2 className="text-4xl text-white font-bold">Top Stats</h2>
                  <div className="flex gap-8">
                    <div className="border-spotify-green border rounded-xl p-6 w-1/2">
                      <h3 className="text-2xl text-white font-bold pb-4">Top Artists</h3>
                      <div className="flex flex-col">
                        {
                          Object.entries(spotifyStats!.artistAppearances).map(([artist, count], i) => {
                            return (
                              <p key={i} className="text-spotify-text text-lg"><span className="font-semibold text-spotify-main">{i + 1}. {artist}</span> - <span className="text-green-600">{count}</span> plays</p>
                            )
                          })
                        }
                      </div>

                    </div>
                    <div className="border-spotify-green border rounded-xl p-6 w-1/2">
                      <h3 className="text-2xl text-white font-bold pb-4">Top Songs</h3>
                      <div className="flex flex-col">
                        {
                          Object.entries(spotifyStats!.songAppearances).map(([song, count], i) => {
                            return (
                              <p key={i} className="text-spotify-text text-lg"><span className="font-semibold text-spotify-main">{i + 1}. {song}</span> - <span className="text-green-600">{count}</span> plays</p>
                            )
                          })
                        }
                      </div>

                    </div>
                  </div>

                </div>
              </div>
              <div className="w-1/4">
                <h2 className="text-4xl text-white font-bold pb-4">Artists By the Numbers</h2>
                <div className="flex flex-col">
                  {
                    spotifyStats!.minutesPerArtist.map(({ artist, minutes }, i) => {
                      return (
                        <p key={i} className="text-spotify-text text-xl"><span className="font-semibold text-spotify-main">{i + 1}. {artist}</span> - <span className="text-green-600">{minutes}</span> minutes</p>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            
          </div>

        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-full">
            <label className="flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-spotify-main">Upload Spotify Data</span>
              <FileInput setFile={setFile} fileName={file!} />
            </label>
            <button
              type="submit"
              className="bg-spotify-green text-white p-2 rounded-lg mt-4 w-full"
            >
              Submit
            </button>
          </form>
        )
      }


    </main>
  );
}
