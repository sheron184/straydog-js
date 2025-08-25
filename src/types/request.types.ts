export interface iOptions {
	exclude: string[]
}

export type LogRequest = {
	id: string
	path: string
	method: string
	latency: number
	start_time: string
	status_code: number
	error: string
	error_stack: string
}