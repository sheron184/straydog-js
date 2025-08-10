import { Application } from "express";
import { expressListEndpoints } from "../../utils/express.utils";

export function appHandler(app: Application) {
	const routes = expressListEndpoints(app, '');
	console.log(routes); 
}