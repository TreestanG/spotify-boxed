import { NextResponse } from "next/server";
import fs, { writeFileSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { File } from "buffer";
import AdmZip from 'adm-zip'
import path from "path";

interface Song {
    endTime: string;
    artistName: string;
    trackName: string;
    msPlayed: number;
}

interface Identity {
    displayName: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    largeImageUrl: string;
    tasteMaker: boolean;
    verified: boolean;
}


export async function POST(req: any, res: any) {

    const formData = await req.formData();
    const file: File = formData.get('file')
    const filePath = path.join(`/tmp/${file.name}`);

    const buffer = Buffer.from(await file.arrayBuffer())

    const fileDir = path.join('/tmp')

    try {

        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(path.join('/tmp'), { recursive: true })
        }

        await writeFileSync(filePath, buffer) 
    } catch (e) {
    }

    const zip = new AdmZip(filePath)
    zip.extractAllTo(fileDir, true)

    const streamingHistory: Song[] = JSON.parse(fs.readFileSync(path.join(fileDir, "Spotify Account Data/StreamingHistory_music_0.json"), 'utf-8'))
    const songs = streamingHistory.filter(song => song.endTime.includes('2024'))

    function topCategoryEntries(songs: Song[], key: 'artistName' | 'trackName', limit: number) {
        return Object.fromEntries(Object.entries(songs.map(c => c[key]).reduce<Record<string, number>>((acc, song) => {
            const key = song
            acc[key] = acc[key] ? ++acc[key] : acc[key] = 1, acc
            return acc
        }, {})).sort((a, b) => b[1] - a[1]).slice(0, limit))
    }

    const thisYearArtistAppearances = topCategoryEntries(songs, 'artistName', 10)
    const thisYearSongAppearances = topCategoryEntries(songs, 'trackName', 10)
    const thisYearSongs = songs.length
    const thisYearMsPlayed = songs.reduce((acc, song) => acc + song.msPlayed, 0)
    const thisYearMinutesPlayed = Math.floor(thisYearMsPlayed / 60000)
    const thisYearHoursPlayed = Math.floor(thisYearMinutesPlayed / 60)
    const thisYearDaysPlayed = Math.floor(thisYearHoursPlayed / 24)

    const thisYearUniqueArtists = songs.map(c => c.artistName).filter((value, index, self) => self.indexOf(value) === index)
    const thisYearMinutesPerArtist = thisYearUniqueArtists.map(artist => streamingHistory.filter(song => song.artistName === artist).reduce((acc, song) => acc + song.msPlayed, 0) / 60000)
        .map((minutes, i) => ({ artist: thisYearUniqueArtists[i], minutes: Math.floor(minutes) })).sort((a, b) => b.minutes - a.minutes).slice(0, 10)

    const allTimeArtistAppearances = topCategoryEntries(streamingHistory, 'artistName', 10)
    const allTimeSongAppearances = topCategoryEntries(streamingHistory, 'trackName', 10)
    const allTimeSongs = streamingHistory.length
    const allTimeMsPlayed = streamingHistory.reduce((acc, song) => acc + song.msPlayed, 0)
    const allTimeMinutesPlayed = Math.floor(allTimeMsPlayed / 60000)
    const allTimeHoursPlayed = Math.floor(allTimeMinutesPlayed / 60)
    const allTimeDaysPlayed = Math.floor(allTimeHoursPlayed / 24)

    const allTimeUniqueArtists = streamingHistory.map(c => c.artistName).filter((value, index, self) => self.indexOf(value) === index)
    const allTimeMinutesPerArtist = allTimeUniqueArtists.map(artist => streamingHistory.filter(song => song.artistName === artist).reduce((acc, song) => acc + song.msPlayed, 0) / 60000)
    .map((minutes, i) => ({ artist: allTimeUniqueArtists[i], minutes: Math.floor(minutes) })).sort((a, b) => b.minutes - a.minutes).slice(0, 10)
    

    const userIdentity: Identity = JSON.parse(fs.readFileSync(path.join(fileDir, "Spotify Account Data/Identity.json"), 'utf-8'))
    const displayName = userIdentity.displayName
    const imageUrl = userIdentity.imageUrl

    const data = {
        current: {
            artistAppearances: thisYearArtistAppearances,
            songAppearances: thisYearSongAppearances,
            songs: thisYearSongs,
            minutesPlayed: thisYearMinutesPlayed,
            hoursPlayed: thisYearHoursPlayed,
            daysPlayed: thisYearDaysPlayed,
            uniqueArtists: thisYearUniqueArtists,
            minutesPerArtist: thisYearMinutesPerArtist
        },
        allTime: {
            artistAppearances: allTimeArtistAppearances,
            songAppearances: allTimeSongAppearances,
            songs: allTimeSongs,
            minutesPlayed: allTimeMinutesPlayed,
            hoursPlayed: allTimeHoursPlayed,
            daysPlayed: allTimeDaysPlayed,
            uniqueArtists: allTimeUniqueArtists,
            minutesPerArtist: allTimeMinutesPerArtist
        },
        user: {
            displayName,
            imageUrl
        }
    }
    await deleteFolderRecursive(path.join(fileDir, "Spotify Account Data"))
    await fs.unlinkSync(filePath)

    return NextResponse.json(data)
}

const deleteFolderRecursive = (path: string) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            let curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};