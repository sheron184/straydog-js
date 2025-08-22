import express, { Request, Response } from "express";
import { expressListEndpoints } from "../../utils/express.utils";
import { BaseAppHandlerInterface } from "./base.handler";
import path from "path";
import { handleApiRequest } from "../api/express.api";

export class ExpressAppHandler implements BaseAppHandlerInterface {
	getRouteList(app: any) {
		return expressListEndpoints(app, '');
	} 

	init(app: any) {

		const uiPath = "/straydog";
		const staticPath = path.join(__dirname, "../ui");

		// Serve React static files
		app.use(uiPath, express.static(staticPath));

		// Add API path
		app.get("/straydog/api", (req: Request,res: Response) => {
			const method = (req.query.method as string) || "getRequests";
			const result = handleApiRequest(req, res, method, app);
			res.json(result);
		});
	}
}