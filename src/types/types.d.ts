export interface SpotifyData {
    current: Stats;
    allTime: Stats;
    user: User;
}

export interface Stats {
    artistAppearances: { [key: string]: number };
    songAppearances: { [key: string]: number };
    songs: number;
    minutesPlayed: number;
    hoursPlayed: number;
    daysPlayed: number;
    uniqueArtists: string[];
    minutesPerArtist: MinutesPerArtist[];
}

export interface MinutesPerArtist {
    artist: string;
    minutes: number;
}

export interface User {
    displayName: string;
    imageUrl: string;
}
