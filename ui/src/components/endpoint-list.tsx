import { Card, CardContent } from "./ui/card";

const EndpointList = ({ endpoints }: { endpoints: any[] }) => {
	return (
		<>
			{endpoints.map((e) => {
				return (
					<Card className={`py-0 mb-1 w-full border-0 shadow-none rounded-none ${e.failed > 0 ? 'bg-red-600': 'unset'}`}>
						<CardContent className="py-1 px-2 flex justify-between pe-6">
							<a className="text-white text-sm">{e.path}</a>
							<div className="flex gap-2">
								{e.failed > 0 ? <span className="text-xs mb-0 bg-black px-2 py-0 rounded-full">Failed: {e.failed}</span> : null}
								<span className="text-xs mb-0 px-2 py-0 rounded-full bg-black">total: {e.total}</span>
							</div>
							<span className="font-medium text-sm">{e.methods[0]}</span>
						</CardContent>
					</Card>
				)
			})}
		</>
	);
}

export default EndpointList;