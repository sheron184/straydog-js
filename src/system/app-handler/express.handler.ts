import { expressListEndpoints } from "../../utils/express.utils";
import { dashboardHnadler } from "../dashboard-handle";
import { BaseAppHandlerInterface } from "./base.handler";

export class ExpressAppHandler implements BaseAppHandlerInterface {
	getRouteList(app: any) {
		return expressListEndpoints(app, '');
	} 

	init(app: any) {
		// Init dashboard route
		app.get('/monitoring', (req: any,res: any) => {
			dashboardHnadler(req, res);
		});
	}
}