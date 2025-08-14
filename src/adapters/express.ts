import { Application, Request, Response, NextFunction } from "express";
import { BaseAppHandler } from "../system/app-handler/base.handler";
import { ExpressAppHandler } from "../system/app-handler/express.handler";
import { ExpressRequestHandler } from "../system/request-handler/express.request";
import { ExpressResponseHandler } from "../system/response-handler/express.response";

export class ExpressAdapter {
	public app: Application | null;

	constructor() {
		this.app = null;
	}

	monitor(app: Application) {
		this.app = app;
		// Initiating app handler
		const expressAppHandler = new ExpressAppHandler();
		const appHandler = new BaseAppHandler(expressAppHandler);
		
		// Init monitoring
		appHandler.init(app); 

 		app.use((req: Request, res: Response, next) => {
			const start = process.hrtime.bigint();

			// Handle request
			const requestHandler = new ExpressRequestHandler(req);
			const requestId = requestHandler.save();
			console.log('response xxx1');

			// Handle response
			res.on('finish', () => {
				console.log('response fini');
				const end = process.hrtime.bigint();
				const latencyMs = Number(end - start) / 1_000_000; 
				const responseHandler = new ExpressResponseHandler(res, latencyMs, requestId);
				responseHandler.save();
			});
			
			// Continue current request
			next();
		});
	}
}

 