import { Skeleton } from "@/components/ui/skeleton"

export function MainLoader() {
	return (
		<div className="flex space-x-3">
			<div>
				<Skeleton className="h-[125px] w-[250px] rounded-xl" />
				<div className="space-y-2 mt-3">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
			<div>
				<Skeleton className="h-[125px] w-[250px] rounded-xl" />
				<div className="space-y-2 mt-3">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
		</div>
	)
}
