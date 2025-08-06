import { Application, Request, Response } from "express";

export class ExpressAdapter {
	constructor(app: Application){
		app.use((req: Request, res: Response) => {
			// Verify is app express
			// Init request perf details
			// Get request data 
		});
	}
}

