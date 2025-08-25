import { Application, Request, Response, NextFunction } from "express";
import { BaseAppHandler } from "../system/app-handler/base.handler";
import { ExpressAppHandler } from "../system/app-handler/express.handler";
import { ExpressRequestHandler } from "../system/request-handler/express.request";
import { ExpressResponseHandler } from "../system/response-handler/express.response";
import { iOptions } from "../types/request.types";
import { BaseModel } from "../config/data/base.model";

export class ExpressAdapter {
	public app: Application;
	private options: iOptions;
	private requestId: number = 0;

	constructor(app: Application, options: iOptions = { exclude: ['/straydog/api'] }) {
		this.app = app;
		this.options = options;
		// Setup sqlite db file
		const baseModel = new BaseModel('');
		baseModel.init();
	}

	observe() {
		// Initiating app handler
		const expressAppHandler = new ExpressAppHandler();
		const appHandler = new BaseAppHandler(expressAppHandler);

		// Init monitoring
		appHandler.init(this.app);

		this.app.use((req: Request, res: Response, next) => {
			const start = process.hrtime.bigint();
			// Handle request
			const requestHandler = new ExpressRequestHandler(req, this.options);

			// Ignore if the route is added in the excluded array
			if (!requestHandler.excluded) {
				const requestId = requestHandler.save();
				this.requestId = requestId;

				// Handle response
				res.on('finish', () => {
					if (res.statusCode < 400 || res.statusCode == 404) {
						const end = process.hrtime.bigint();
						const latencyMs = Number(end - start) / 1_000_000;
						const responseHandler = new ExpressResponseHandler(res, null, latencyMs, requestId);
						responseHandler.save();
					}
				});
			}

			// Continue current request
			next();
		});
	}

	catch() {
		this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			// Optionally attach requestId for correlation
			const requestHandler = new ExpressRequestHandler(req, this.options);

			if (!requestHandler.excluded) {
				// const requestId = requestHandler.save();
				res.on('finish', () => {
					// Save error to monitoring
					const responseHandler = new ExpressResponseHandler(
						res,
						err,
						0, // latency unknown here
						this.requestId
					);
					responseHandler.save();
				});

			}
			// Always forward the error
			next(err);
		});
	}
}

