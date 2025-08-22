import { Card, CardContent } from "./ui/card";

const EndpointList = ({ endpoints }: { endpoints: any[] }) => {
	return (
		<>
			{endpoints.map((e) => {
				return (
					<Card className="py-1 mb-3 w-1/3 border-0 border-b-1 shadow-none rounded-none">
						<CardContent className="py-1 px-2 flex justify-between pe-6">
							<a href={e.path} className="text-blue-500">{e.path}</a>
							<span className="font-medium">{e.methods[0]}</span>
						</CardContent>
					</Card>
				)
			})}
		</>
	);
}

export default EndpointList;