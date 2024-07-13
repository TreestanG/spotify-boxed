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

const demo = { "thisYear": { "artistAppearances": { "Taylor Swift": 523, "Ed Sheeran": 489, "Ariana Grande": 412, "Billie Eilish": 378, "Post Malone": 301, "Dua Lipa": 287, "The Weeknd": 265, "Imagine Dragons": 243, "Coldplay": 221, "Adele": 198 }, "songAppearances": { "Shape of You": 156, "Blinding Lights": 134, "Bad Guy": 112, "7 Rings": 98, "Watermelon Sugar": 89, "Dance Monkey": 87, "Someone You Loved": 85, "Levitating": 82, "Shallow": 79, "Believer": 76 }, "songs": 6234, "minutesPlayed": 13572, "hoursPlayed": 226, "daysPlayed": 9, "uniqueArtists": ["Taylor Swift", "Ed Sheeran", "Ariana Grande", "Billie Eilish", "Post Malone", "Dua Lipa", "The Weeknd", "Imagine Dragons", "Coldplay", "Adele", "Justin Bieber", "Shawn Mendes", "Maroon 5", "Lady Gaga", "Bruno Mars", "Sia", "Rihanna", "Katy Perry", "Halsey", "Selena Gomez"], "minutesPerArtist": [{ "artist": "Taylor Swift", "minutes": 1345 }, { "artist": "Ed Sheeran", "minutes": 1203 }, { "artist": "Ariana Grande", "minutes": 1098 }, { "artist": "Billie Eilish", "minutes": 987 }, { "artist": "Post Malone", "minutes": 876 }, { "artist": "Dua Lipa", "minutes": 765 }, { "artist": "The Weeknd", "minutes": 654 }, { "artist": "Imagine Dragons", "minutes": 543 }, { "artist": "Coldplay", "minutes": 432 }, { "artist": "Adele", "minutes": 321 }] }, "allTime": { "artistAppearances": { "Taylor Swift": 823, "Ed Sheeran": 789, "Ariana Grande": 712, "Billie Eilish": 678, "Post Malone": 601, "Dua Lipa": 587, "The Weeknd": 565, "Imagine Dragons": 543, "Coldplay": 521, "Adele": 498 }, "songAppearances": { "Shape of You": 256, "Blinding Lights": 234, "Bad Guy": 212, "7 Rings": 198, "Watermelon Sugar": 189, "Dance Monkey": 187, "Someone You Loved": 185, "Levitating": 182, "Shallow": 179, "Believer": 176 }, "songs": 9876, "minutesPlayed": 21345, "hoursPlayed": 355, "daysPlayed": 14, "uniqueArtists": ["Taylor Swift", "Ed Sheeran", "Ariana Grande", "Billie Eilish", "Post Malone", "Dua Lipa", "The Weeknd", "Imagine Dragons", "Coldplay", "Adele", "Justin Bieber", "Shawn Mendes", "Maroon 5", "Lady Gaga", "Bruno Mars", "Sia", "Rihanna", "Katy Perry", "Halsey", "Selena Gomez"], "minutesPerArtist": [{ "artist": "Taylor Swift", "minutes": 2345 }, { "artist": "Ed Sheeran", "minutes": 2203 }, { "artist": "Ariana Grande", "minutes": 2098 }, { "artist": "Billie Eilish", "minutes": 1987 }, { "artist": "Post Malone", "minutes": 1876 }, { "artist": "Dua Lipa", "minutes": 1765 }, { "artist": "The Weeknd", "minutes": 1654 }, { "artist": "Imagine Dragons", "minutes": 1543 }, { "artist": "Coldplay", "minutes": 1432 }, { "artist": "Adele", "minutes": 1321 }] }, "lastMonth": { "artistAppearances": { "Taylor Swift": 123, "Ed Sheeran": 112, "Ariana Grande": 98, "Billie Eilish": 87, "Post Malone": 76, "Dua Lipa": 65, "The Weeknd": 54, "Imagine Dragons": 43, "Coldplay": 32, "Adele": 21 }, "songAppearances": { "Shake It Off": 34, "Perfect": 32, "Thank U, Next": 29, "Everything I Wanted": 27, "Circles": 25, "Don't Start Now": 23, "Blinding Lights": 21, "Thunder": 19, "Viva La Vida": 17, "Rolling in the Deep": 15 }, "songs": 1543, "minutesPlayed": 3210, "hoursPlayed": 53, "daysPlayed": 2, "uniqueArtists": ["Taylor Swift", "Ed Sheeran", "Ariana Grande", "Billie Eilish", "Post Malone", "Dua Lipa", "The Weeknd", "Imagine Dragons", "Coldplay", "Adele"], "minutesPerArtist": [{ "artist": "Taylor Swift", "minutes": 345 }, { "artist": "Ed Sheeran", "minutes": 321 }, { "artist": "Ariana Grande", "minutes": 298 }, { "artist": "Billie Eilish", "minutes": 276 }, { "artist": "Post Malone", "minutes": 254 }, { "artist": "Dua Lipa", "minutes": 232 }, { "artist": "The Weeknd", "minutes": 210 }, { "artist": "Imagine Dragons", "minutes": 188 }, { "artist": "Coldplay", "minutes": 166 }, { "artist": "Adele", "minutes": 144 }] }, "lastWeek": { "artistAppearances": { "Taylor Swift": 45, "Ed Sheeran": 38, "Ariana Grande": 32, "Billie Eilish": 27, "Post Malone": 23, "Dua Lipa": 19, "The Weeknd": 16, "Imagine Dragons": 13, "Coldplay": 10, "Adele": 8 }, "songAppearances": { "Lover": 12, "Shape of You": 10, "No Tears Left To Cry": 9, "Ocean Eyes": 8, "Sunflower": 7, "Physical": 6, "Save Your Tears": 5, "Radioactive": 4, "Yellow": 3, "Hello": 2 }, "songs": 321, "minutesPlayed": 678, "hoursPlayed": 11, "daysPlayed": 0, "uniqueArtists": ["Taylor Swift", "Ed Sheeran", "Ariana Grande", "Billie Eilish", "Post Malone", "Dua Lipa", "The Weeknd", "Imagine Dragons", "Coldplay", "Adele"], "minutesPerArtist": [{ "artist": "Taylor Swift", "minutes": 123 }, { "artist": "Ed Sheeran", "minutes": 110 }, { "artist": "Ariana Grande", "minutes": 98 }, { "artist": "Billie Eilish", "minutes": 87 }, { "artist": "Post Malone", "minutes": 76 }, { "artist": "Dua Lipa", "minutes": 65 }, { "artist": "The Weeknd", "minutes": 54 }, { "artist": "Imagine Dragons", "minutes": 43 }, { "artist": "Coldplay", "minutes": 32 }, { "artist": "Adele", "minutes": 21 }] }, "user": { "displayName": "demo user", "imageUrl": "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/the-green-forest-square-bill-wakeley.jpg" } }
export async function POST(req: any, res: any) {

    const formData = await req.formData();
    const file = formData.get('file')
    if (file === "null" && formData.get('demo') === 'true') {
        return NextResponse.json(demo)
    }
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

    const files = fs.readdirSync(path.join(fileDir, "Spotify Account Data")).filter(file => file.startsWith('StreamingHistory_music'))

    if (files.length === 0) {
        return NextResponse.json({ error: 'No streaming history found' })
    }

    let streamingHistory: Song[] = []

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(fileDir, "Spotify Account Data", file), 'utf-8'))
        streamingHistory = streamingHistory.concat(data)
    }

    //const streamingHistory: Song[] = JSON.parse(fs.readFileSync(path.join(fileDir, "Spotify Account Data/StreamingHistory_music_0.json"), 'utf-8'))
    const thisYear = fetchDataTime(streamingHistory, 'thisYear')
    const allTime = fetchDataTime(streamingHistory, 'allTime')
    const lastMonth = fetchDataTime(streamingHistory, 'lastMonth')
    const lastWeek = fetchDataTime(streamingHistory, 'lastWeek')    

    const userIdentity: Identity = JSON.parse(fs.readFileSync(path.join(fileDir, "Spotify Account Data/Identity.json"), 'utf-8'))
    const displayName = userIdentity.displayName
    const imageUrl = userIdentity.largeImageUrl
    console.log(imageUrl)

    const data = {
        thisYear,
        allTime,
        lastMonth,
        lastWeek,
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

const fetchDataTime = (streamingHistory: Song[], time: string) => {
    let songs: Song[] = [];

    switch (time) {
        case 'thisYear':
            songs = streamingHistory.filter(song => new Date(song.endTime).getFullYear() === new Date().getFullYear())
            break;
        case 'allTime':
            songs = streamingHistory
            break;
        case 'lastMonth':
            songs = streamingHistory.filter(song => new Date(song.endTime).getMonth() === new Date().getMonth() - 1)
            break;
        case 'lastWeek':
            songs = streamingHistory.filter(song => new Date(song.endTime).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            break;
    }

    function topCategoryEntries(songs: Song[], key: 'artistName' | 'trackName', limit: number) {
        return Object.fromEntries(Object.entries(songs.map(c => c[key]).reduce<Record<string, number>>((acc, song) => {
            const key = song
            acc[key] = acc[key] ? ++acc[key] : acc[key] = 1, acc
            return acc
        }, {})).sort((a, b) => b[1] - a[1]).slice(0, limit))
    }

    const artistAppearances = topCategoryEntries(songs, 'artistName', 10)
    const songAppearances = topCategoryEntries(songs, 'trackName', 10)
    const totalSongs = songs.length
    const msPlayed = songs.reduce((acc, song) => acc + song.msPlayed, 0)
    const minutesPlayed = Math.floor(msPlayed / 60000)
    const hoursPlayed = Math.floor(minutesPlayed / 60)
    const daysPlayed = Math.floor(hoursPlayed / 24)

    const thisYearUniqueArtists = songs.map(c => c.artistName).filter((value, index, self) => self.indexOf(value) === index)
    const thisYearMinutesPerArtist = thisYearUniqueArtists.map(artist => songs.filter(song => song.artistName === artist).reduce((acc, song) => acc + song.msPlayed, 0) / 60000)
        .map((minutes, i) => ({ artist: thisYearUniqueArtists[i], minutes: Math.floor(minutes) })).sort((a, b) => b.minutes - a.minutes).slice(0, 10)
    //console.log(thisYearMinutesPerArtist)

    return {
        artistAppearances,
        songAppearances,
        songs: totalSongs,
        minutesPlayed,
        hoursPlayed,
        daysPlayed,
        uniqueArtists: thisYearUniqueArtists,
        minutesPerArtist: thisYearMinutesPerArtist
    }

}