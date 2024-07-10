interface LeaderboardProps {
    title: string;
    measures: string;
    data: { [key: string]: number };
}

export default function Leaderboard({
    title, measures, data
}: LeaderboardProps) {
    return (
        <div className="border-spotify-green border rounded-xl p-6 w-full">
            <div className="flex w-full justify-between items-end">
                <h3 className="text-2xl text-white font-bold pb-4">{title}</h3>
                <h2 className="text-xl text-white font-bold pb-4">{measures}</h2>
            </div>
            <div className="flex flex-col w-full">
                {
                    Object.entries(data).map(([entry, count], i) => {
                        return (
                            <div key={i} className="flex w-full justify-between text-spotify-text">
                                <p className=" text-lg"><span className="font-semibold text-spotify-main">{i + 1}. {entry}</span></p>
                                <p className="text-green-600">{count}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}