import { Application, Request, Response } from "express";
import { Api } from "./api";

class ExpressApi {
	private api: Api;

	constructor(days: number) {
		this.api = new Api(days);
	}

	getRequests(req: Request, app: Application) {
		return this.api.requests();
	}

	getStats(req: Request, app: Application) {
		return this.api.getStats();
	}

	getEndpoints(req: Request, app: Application) {
		return this.api.getEndpoints(app);
	}

	getErrorRequests(req: Request, app: Application){
		return this.api.getErrorRequests();
	}
}

export function handleApiRequest(
	req: Request, 
	res: Response, 
	func: string, 
	app: Application): any {
	const service = new ExpressApi(parseInt(req.query.days as string) || 3);
	return (service as any)[func](req, app);
}

