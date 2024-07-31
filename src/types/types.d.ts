export interface SpotifyData {
    thisYear: Stats;
    allTime: Stats;
    lastMonth: Stats;
    lastWeek: Stats;
    user: User;
}

export interface NormalStats {
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

export interface NormalSong {
    endTime: string;
    artistName: string;
    trackName: string;
    msPlayed: number;
}

export interface ExtendedSong {
    ts: Date;
    platform: string;
    ms_played: number;
    conn_country: string;
    master_metadata_track_name: string;
    master_metadata_album_artist_name: string;
    master_metadata_album_album_name: string;
    reason_start: string;
    reason_end: string;
    shuffle: boolean;
    skipped: boolean;
}

export interface ExtendedStats {
    artistAppearances: { [key: string]: number };
    songAppearances: { [key: string]: number };
    albumAppearances: AlbumAppearance[];
    songs: number;
    minutesPlayed: number;
    hoursPlayed: number;
    daysPlayed: number;
    uniqueArtists: Array<null | string>;
    minutesPerArtist: MinutesPerArtist[];
}

export interface AlbumAppearance {
    albumName: string;
    albumArtist: string;
    appearances: number;
}

export interface MinutesPerArtist {
    artist: string;
    minutes: number;
}

