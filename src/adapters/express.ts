import { Application, Request, Response } from "express";
import { appHandler } from "../system/handlers/handler.express";

export class ExpressAdapter {
	public app: Application | null;

	constructor() {
		this.app = null;
	}

	monitor(app: Application) {
		this.app = app;
		appHandler(app)
		
		app.use((req: Request, res: Response, next) => {
			// Verify is app express
			// Init app details (paths, name, etc..)
			// Get request data 
			console.log('express app recevied!');
			next();
		});
	}
}

 