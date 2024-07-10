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

const demo = { "current": { "artistAppearances": { "Taylor Swift": 723, "Ed Sheeran": 589, "Ariana Grande": 542, "Post Malone": 481, "Beyoncé": 376, "The Weeknd": 345, "Billie Eilish": 322, "Bruno Mars": 309, "Cardi B": 285, "Shawn Mendes": 260 }, "songAppearances": { "Shape of You": 145, "Blinding Lights": 130, "Thank U, Next": 122, "Circles": 118, "Bad Guy": 115, "Senorita": 110, "Drivers License": 105, "Old Town Road": 100, "Levitating": 98, "Havana": 95 }, "songs": 9120, "minutesPlayed": 18256, "hoursPlayed": 304, "daysPlayed": 13, "uniqueArtists": ["Taylor Swift", "Ed Sheeran", "Ariana Grande", "Post Malone", "Beyoncé", "The Weeknd", "Billie Eilish", "Bruno Mars", "Cardi B", "Shawn Mendes", "Lady Gaga", "Justin Bieber", "Dua Lipa", "Rihanna", "Harry Styles", "Maroon 5", "Doja Cat", "Katy Perry", "Sam Smith", "Halsey", "Coldplay", "Imagine Dragons", "Selena Gomez", "Adele", "Lizzo", "Drake", "Miley Cyrus", "SZA", "Olivia Rodrigo", "Lana Del Rey", "Camila Cabello", "Charlie Puth", "Nicki Minaj", "Jonas Brothers", "Zayn", "BTS", "BLACKPINK", "EXO", "TWICE", "NCT", "Monsta X", "Red Velvet", "Stray Kids", "TXT", "ITZY", "ATEEZ", "ENHYPEN", "SEVENTEEN", "SHINee", "SuperM", "BigBang", "2NE1", "G-Dragon", "Taeyeon", "IU", "Lee Hi", "Sunmi", "Chungha", "Somi", "HyunA", "CL", "Jessie J", "Bebe Rexha", "Ava Max", "Tones and I", "Sia", "Ellie Goulding", "Zara Larsson", "Demi Lovato", "Kehlani", "Alessia Cara", "Tori Kelly", "Rita Ora", "Bebe Rexha", "Janelle Monáe", "H.E.R.", "Kehlani", "Normani", "Maggie Rogers", "FKA Twigs", "BANKS", "Troye Sivan", "Lauv", "Khalid", "James Arthur", "Lewis Capaldi", "Conan Gray", "Ruel", "Shawn Mendes", "Jacob Collier", "Rex Orange County", "Joji", "HONNE", "LANY", "The 1975", "Glass Animals", "Tame Impala", "Mac DeMarco", "Clairo", "Gorillaz", "Arctic Monkeys", "Cage The Elephant", "Florence + The Machine", "Hozier", "Lorde"], "minutesPerArtist": [{ "artist": "Taylor Swift", "minutes": 1760 }, { "artist": "Ed Sheeran", "minutes": 1485 }, { "artist": "Ariana Grande", "minutes": 1352 }, { "artist": "Post Malone", "minutes": 1275 }, { "artist": "Beyoncé", "minutes": 1040 }, { "artist": "The Weeknd", "minutes": 965 }, { "artist": "Billie Eilish", "minutes": 892 }, { "artist": "Bruno Mars", "minutes": 857 }, { "artist": "Cardi B", "minutes": 812 }, { "artist": "Shawn Mendes", "minutes": 768 }], "user": { "displayName": "musicLover123", "imageUrl": "https://example.com/image/musiclover123.jpg" } }, "allTime": { "artistAppearances": { "Taylor Swift": 723, "Ed Sheeran": 589, "Ariana Grande": 542, "Post Malone": 481, "Beyoncé": 376, "The Weeknd": 345, "Billie Eilish": 322, "Bruno Mars": 309, "Cardi B": 285, "Shawn Mendes": 260 }, "songAppearances": { "Shape of You": 145, "Blinding Lights": 130, "Thank U, Next": 122, "Circles": 118, "Bad Guy": 115, "Senorita": 110, "Drivers License": 105, "Old Town Road": 100, "Levitating": 98, "Havana": 95 }, "songs": 9120, "minutesPlayed": 18256, "hoursPlayed": 304, "daysPlayed": 13, "uniqueArtists": ["Taylor Swift", "Ed Sheeran", "Ariana Grande", "Post Malone", "Beyoncé", "The Weeknd", "Billie Eilish", "Bruno Mars", "Cardi B", "Shawn Mendes", "Lady Gaga", "Justin Bieber", "Dua Lipa", "Rihanna", "Harry Styles", "Maroon 5", "Doja Cat", "Katy Perry", "Sam Smith", "Halsey", "Coldplay", "Imagine Dragons", "Selena Gomez", "Adele", "Lizzo", "Drake", "Miley Cyrus", "SZA", "Olivia Rodrigo", "Lana Del Rey", "Camila Cabello", "Charlie Puth", "Nicki Minaj", "Jonas Brothers", "Zayn", "BTS", "BLACKPINK", "EXO", "TWICE", "NCT", "Monsta X", "Red Velvet", "Stray Kids", "TXT", "ITZY", "ATEEZ", "ENHYPEN", "SEVENTEEN", "SHINee", "SuperM", "BigBang", "2NE1", "G-Dragon", "Taeyeon", "IU", "Lee Hi", "Sunmi", "Chungha", "Somi", "HyunA", "CL", "Jessie J", "Bebe Rexha", "Ava Max", "Tones and I", "Sia", "Ellie Goulding", "Zara Larsson", "Demi Lovato", "Kehlani", "Alessia Cara", "Tori Kelly", "Rita Ora", "Bebe Rexha", "Janelle Monáe", "H.E.R.", "Kehlani", "Normani", "Maggie Rogers", "FKA Twigs", "BANKS", "Troye Sivan", "Lauv", "Khalid", "James Arthur", "Lewis Capaldi", "Conan Gray", "Ruel", "Shawn Mendes", "Jacob Collier", "Rex Orange County", "Joji", "HONNE", "LANY", "The 1975", "Glass Animals", "Tame Impala", "Mac DeMarco", "Clairo", "Gorillaz", "Arctic Monkeys", "Cage The Elephant", "Florence + The Machine", "Hozier", "Lorde"], "minutesPerArtist": [{ "artist": "Taylor Swift", "minutes": 1760 }, { "artist": "Ed Sheeran", "minutes": 1485 }, { "artist": "Ariana Grande", "minutes": 1352 }, { "artist": "Post Malone", "minutes": 1275 }, { "artist": "Beyoncé", "minutes": 1040 }, { "artist": "The Weeknd", "minutes": 965 }, { "artist": "Billie Eilish", "minutes": 892 }, { "artist": "Bruno Mars", "minutes": 857 }, { "artist": "Cardi B", "minutes": 812 }, { "artist": "Shawn Mendes", "minutes": 768 }] }, "user": { "displayName": "demoUser", "imageUrl": "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/the-green-forest-square-bill-wakeley.jpg" } }

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

    console.log(data.allTime.minutesPerArtist)
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