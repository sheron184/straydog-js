import { Request, Response } from "express";
import path from "path";
import { RequestModel } from "../config/data/request.model";
import { ResponseModel } from "../config/data/response.model";

function getMetrics() {
	return {
		memory: process.memoryUsage(),
		cpu: process.cpuUsage(),
		uptime: process.uptime()
	}
}

function getData() {
	const payload: any[] = [];
	const requestModel = new RequestModel('request');
	const responseModel = new ResponseModel('response');

	const responses = responseModel.getAll();
	const requests = requestModel.getAll();

	// Optimization: Create a map for fast lookup of responses by request_id
	const responseMap = new Map<string, any>();
	for (const resp of responses) {
		responseMap.set(resp.request_id, { ...resp }); // clone to avoid mutating original
	}

	for (const req of requests) {
		const resp = responseMap.get(req.id);
		if (resp) {
			delete resp.id; // Remove id from the cloned response
			payload.push({
				...req,
				...resp,
			});
		}
	}

	return {
		requests: payload,
		metrics: getMetrics(),
	};
}

export function dashboardHnadler(req: Request, res: Response) {
	let templatePath = path.join(__dirname, "ui", 'index.html');
	res.sendFile(templatePath);
}

export function dashboardContentHandler(res:Response, page: string) {
	let templatePath = path.join(__dirname, "ui", `pages/${page}.html`);
	res.sendFile(templatePath);
}