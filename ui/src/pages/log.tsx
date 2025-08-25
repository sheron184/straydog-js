import { logTableColumns } from "@/components/columns";
import ErrorLogTable from "@/components/log-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function LogPage() {
	const params = new URLSearchParams(window.location.search);
	const [timeRange, setTimeRange] = useState<string>(params.get('days') || '1');

	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set('days', timeRange);
		window.history.replaceState({}, '', url);
	}, [timeRange]);

	return (
		<div>
			<Select defaultValue={timeRange} onValueChange={(value) => setTimeRange(value)}>
				<SelectTrigger className="w-[180px] mb-6">
					<SelectValue placeholder="Time Range" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="1">Last day</SelectItem>
					<SelectItem value="3">Last 3 days</SelectItem>
					<SelectItem value="7">Last week</SelectItem>
					<SelectItem value="30">Last month</SelectItem>
					<SelectItem value="90">Last 3 months</SelectItem>
				</SelectContent>
			</Select>
			<ErrorLogTable columns={logTableColumns} days={timeRange} />
		</div>
	)
}