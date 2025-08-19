import { Request, Response } from "express";
import { Api } from "./api";

class ExpressApi {
	private api : Api;

	constructor(){
		this.api = new Api();
	}

	getRequests(){
		return this.api.requests();
	}
}

export function handleApiRequest(req: Request, res: Response, func: string) : any{
	const service = new ExpressApi();
	return (service as any)[func]();
}

