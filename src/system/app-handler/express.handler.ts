import express, { Request, Response } from "express";
import { expressListEndpoints } from "../../utils/express.utils";
import { dashboardContentHandler, dashboardHnadler } from "../dashboard-handle";
import { BaseAppHandlerInterface } from "./base.handler";
import path from "path";
import { handleApiRequest } from "../api/express.api";

export class ExpressAppHandler implements BaseAppHandlerInterface {
	getRouteList(app: any) {
		return expressListEndpoints(app, '');
	} 

	init(app: any) {
		// Init dashboard route
		// app.get('/monitoring', (req: Request, res: Response) => {
		// 	dashboardHnadler(req, res);
		// });
		// app.get('/monitoring/:page', (req: Request, res: Response) => {
		// 	const page = req.params.page;
		// 	dashboardContentHandler(res, page);
		// });

		const uiPath = "/straydog";
		const staticPath = path.join(__dirname, "../ui");

		// Serve React static files
		app.use(uiPath, express.static(staticPath));

		// Add API path
		app.get("/straydog/api", (req: Request,res: Response) => {
			const method = (req.query.method as string) || "getRequests";
			const result = handleApiRequest(req, res, method);
			res.json(result);
		});

		// Serve index.html for SPA routes
		// app.get(uiPath, (req: Request, res: Response) => {
		//   res.sendFile(path.join(staticPath, 'index.html'));
		// });
	}
}