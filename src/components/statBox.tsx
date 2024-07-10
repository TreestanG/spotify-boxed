import NumberTicker from "./numberTicker"

export default function StatBox({
    title, stat
}: {
    title: string, stat: number
}): JSX.Element {
    return (
        <div className="w-1/2 flex flex-col">
            <h2 className="text-4xl font-bold text-green-600">
                <NumberTicker value={stat} />
                </h2>
            <h3 className="text-2xl text-spotify-text">{title}</h3>
        </div>
    )
}