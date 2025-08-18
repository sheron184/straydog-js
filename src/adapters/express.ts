import { Application, Request, Response, NextFunction } from "express";
import { BaseAppHandler } from "../system/app-handler/base.handler";
import { ExpressAppHandler } from "../system/app-handler/express.handler";
import { ExpressRequestHandler } from "../system/request-handler/express.request";
import { ExpressResponseHandler } from "../system/response-handler/express.response";
import { iRequestObserve } from "../types/request.types";
import { Api } from "../system/api/api";

export class ExpressAdapter {
	public app: Application;
	public api: Api;

	constructor(app: Application) {
		this.app = app;
		this.api = new Api();
	}

	observe(options?: iRequestObserve) {
		// Initiating app handler
		const expressAppHandler = new ExpressAppHandler();
		const appHandler = new BaseAppHandler(expressAppHandler);
		
		// Init monitoring
		appHandler.init(this.app); 

		this.app.use((req: Request, res: Response, next) => {
			const start = process.hrtime.bigint();

			// Handle request
			const requestHandler = new ExpressRequestHandler(req);
			const requestId = requestHandler.save();

			// Handle response
			res.on('finish', () => {
				const end = process.hrtime.bigint();
				const latencyMs = Number(end - start) / 1_000_000; 
				const responseHandler = new ExpressResponseHandler(res, null, latencyMs, requestId);
				responseHandler.save();
			});
			
			// Continue current request
			next();
		});
	}

	catch() {
		this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			console.error("💥 Uncaught error:", err);

			// Optionally attach requestId for correlation
			const requestHandler = new ExpressRequestHandler(req);
			const requestId = requestHandler.save();

			// Save error to monitoring
			const responseHandler = new ExpressResponseHandler(
				res,
				err,
				0, // latency unknown here
				requestId
			);
			responseHandler.save();

			// Always forward the error
			next(err);
		});
	}
}

 