'use client'

import { SpotifyData, NormalStats } from "@/types/types";
import Image from "next/image";
import { useState } from "react";
import FileInput from "@/components/fileInput";
import { cn } from "@/lib/utils";
import StatBox from "@/components/statBox";
import Leaderboard from "@/components/leaderboard";
import BlurFade from "@/components/fadeIn";
import Link from "next/link";

type SpotifyKeys = 'thisYear' | 'allTime' | 'lastMonth' | 'lastWeek'

export default function Home() {

    const [file, setFile] = useState<File | null>(null);
    const [stats, setStats] = useState<SpotifyData>();
    const [time, setTime] = useState('thisYear')
    const [spotifyStats, setSpotifyStats] = useState<NormalStats>()
    const [loading, setLoading] = useState(false)
    const [seeDemo, setSeeDemo] = useState(false)

    const handleTimeChange = (time: SpotifyKeys) => {
        setTime(time)
        setSpotifyStats(stats![time])
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file!);
        formData.append("demo", seeDemo ? "true" : "false")

        setLoading(true)
        const res = await fetch("/api/upload-normal", {
            method: "POST",
            body: formData,
        })

        const data = await res.json();
        setStats(data)
        setSpotifyStats(data.thisYear)
        setLoading(false)
    }

    return (
        <main className={cn("min-h-screen w-screen flex justify-center lg:p-0", `${stats ? '' : " items-center"}`)}>
            {
                loading ? (
                    <div>
                        <h1 className="text-4xl text-white font-bold">Loading...</h1>
                    </div>
                ) : (stats ? (
                    <div className="w-full flex flex-col">
                        <div className="w-full h-auto lg:h-[20rem] bg-gradient-to-t from-spotify-header-bottom to-spotify-header-top flex flex-col justify-center lg:pl-20">
                            <Link href="/" className="text-white underline text-lg p-6">Home</Link>
                            <div className="flex flex-col lg:flex-row items-center gap-8 py-6">
                                    <Image src={stats.user.imageUrl} alt="user" width="0" sizes="100vh" height="0" className="w-48 h-48 shadow-2xl rounded-full flex-grow-0" />
                                <h1 className="text-white text-3xl lg:text-8xl font-extrabold">{stats.user.displayName}</h1>
                            </div>
                        </div>
                        <div className="flex text-white px-6 lg:pl-40 gap-4 text-lg lg:text-xl w-full justify-center lg:justify-start pt-20 ">
                            <p onClick={() => handleTimeChange('lastWeek')} className={cn("hover:underline underline-offset-8 cursor-pointer decoration-spotify-green", time === "lastWeek" ? "underline" : "")}>Week</p>
                            <p onClick={() => handleTimeChange('lastMonth')} className={cn("hover:underline underline-offset-8 cursor-pointer decoration-spotify-green", time === "lastMonth" ? "underline" : "")}> Month</p>
                            <p onClick={() => handleTimeChange('thisYear')} className={cn("hover:underline underline-offset-8 cursor-pointer decoration-spotify-green", time === "thisYear" ? "underline" : "")}>This Year</p>
                            <p onClick={() => handleTimeChange('allTime')} className={cn("hover:underline underline-offset-8 cursor-pointer decoration-spotify-green", time === "allTime" ? "underline" : "")}>Past Year</p>

                        </div>
                        <div className="w-full flex pt-12 px-6 lg:pl-40 gap-8">
                            <div className="lg:w-10/12 w-full  flex flex-col gap-20">
                                <div className="flex gap-4 flex-col">
                                    <h2 className="text-4xl text-white font-bold text-center lg:text-start">Pure Numbers</h2>
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="flex gap-4">
                                            {
                                                [spotifyStats!.daysPlayed, spotifyStats!.hoursPlayed].map((stat, i) => {
                                                    return (
                                                        <StatBox key={i} title={["Days Played", "Hours Played"][i]} stat={stat} />
                                                    )
                                                })
                                            }
                                        </div>

                                        <div className="flex gap-4">
                                            {
                                                [spotifyStats!.minutesPlayed, spotifyStats!.songs].map((stat, i) => {
                                                    return (
                                                        <StatBox key={i} title={["Minutes Played", "Songs Played"][i]} stat={stat} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 flex-col max-w-full pb-20">
                                    <h2 className="text-4xl text-white font-bold pb-4">Top Stats</h2>
                                    <div className="flex gap-8 flex-col lg:flex-row">
                                        <BlurFade className="w-full lg:w-1/3" delay={.15}><Leaderboard title="Top Artists" measures="Plays" data={spotifyStats!.artistAppearances} /></BlurFade>
                                        <BlurFade className="w-full lg:w-1/3" delay={.3}><Leaderboard title="Top Songs" measures="Plays" data={spotifyStats!.songAppearances} /></BlurFade>
                                        <BlurFade className="w-full lg:w-1/3" delay={.45}><Leaderboard title="Artists By the Numbers" measures="Minutes" data={Object.fromEntries(spotifyStats!.minutesPerArtist.map(c => [c.artist, c.minutes]))} /></BlurFade>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : (
                    <BlurFade delay={.15} inView className="lg:w-1/3 w-full p-6">
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <Link href="/" className="text-white underline text-lg">Home</Link>
                            <div className="h-[75vh] lg:h-auto flex items-center justify-center flex-col w-full">
                                <label className="flex flex-col items-center justify-center w-full">
                                    <span className="text-4xl lg:text-5xl font-bold text-white">Spotify Boxed - Normal</span>

                                    <FileInput setFile={setFile} fileName={file!} />
                                </label>
                                <p onClick={() => setSeeDemo(!seeDemo)} className={cn(`p-2 rounded-lg w-full mt-4 text-center hover:cursor-pointer`, seeDemo ? "text-white bg-blue-400" : "text-black bg-white hover:bg-opacity-90")}>Toggle Demo Mode</p>

                                <button type="submit" className="bg-spotify-green text-white p-2 rounded-lg mt-2 w-full hover:bg-green-600">Submit</button>
                                <p className="pt-4 text-spotify-text">If you don&apos;t have your data yet, click on &quot;Toggle Demo&quot; and click submit.</p>

                            </div>
                                    <div className="text-spotify-text pt-4 flex flex-col justify-start w-full">
                                        <p className="text-lg font-semibold text-spotify-main">Instructions:</p>
                                        <p className="">1. Log into Spotify through their <Link href="https://open.spotify.com/" className="text-blue-400 underline">website</Link></p>
                                        <p className="">2. Click on your profile icon on the top right and click <span className="font-semibold">Account</span></p>
                                        <p className="">3. Scroll down to the <span className="font-semibold">Security and privacy</span> and click <span className="font-semibold">Privacy settings</span> </p>
                                        <p className="">4. Scroll down to <span className="font-semibold">Request data</span></p>
                                        <p className="">5. Click <span className="font-semibold">Request data</span> and click on CONFIRM in the email Spotify sends you</p>
                                        <p className="">6. Wait a few days for the email containing your data and press <span className="font-semibold">download</span>.</p>
                                        <p className="">7. Upload the zip file here and enjoy :) </p>
                                        <p className="">Note: the data here will only contain music you&apos;ve listened to in <span className="text-white font-semibold">the past year.</span></p>

                                        <p className="text-lg text-white pt-4">We do <span className="underline">not</span> store your data. The file uploaded is only temporary within our systems and is immediately deleted after retrieving necessary data. </p>
                                    </div>
                        </form>
                    </BlurFade>
                ))
            }
        </main>
    );
}
