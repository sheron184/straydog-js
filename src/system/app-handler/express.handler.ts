import { Request, Response } from "express";
import { expressListEndpoints } from "../../utils/express.utils";
import { dashboardContentHandler, dashboardHnadler } from "../dashboard-handle";
import { BaseAppHandlerInterface } from "./base.handler";

export class ExpressAppHandler implements BaseAppHandlerInterface {
	getRouteList(app: any) {
		return expressListEndpoints(app, '');
	} 

	init(app: any) {
		// Init dashboard route
		app.get('/monitoring', (req: Request, res: Response) => {
			dashboardHnadler(req, res);
		});
		app.get('/monitoring/:page', (req: Request, res: Response) => {
			const page = req.params.page;
			dashboardContentHandler(res, page);
		});
	}
}