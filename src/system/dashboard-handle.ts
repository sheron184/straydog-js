import { Request, Response } from "express";
import path from "path";
import ejs from 'ejs';
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
	const payload : any[] = [];
	const requestModel = new RequestModel('request');
	const responseModel = new ResponseModel('response');

	const responses = responseModel.getAll();
	const requests = requestModel.getAll();

	requests.forEach((req) => {
		const resp = responses.find((r) => r.request_id === req.id);
		delete resp?.id;
		if(resp){
			payload.push({
				...req,
				...resp,
			});
		}
	});
	return {
		requests: payload,
		metrics: getMetrics()
	}
}

export function dashboardHnadler(req: Request, res: Response) {
	const data = getData();
	console.log(data);

	const templatePath = path.join(__dirname, "ui", "index.ejs");
	
	ejs.renderFile(templatePath, data, {}, (err, html) => {
		if (err) return res.status(500).send(err.message);
		res.send(html);
	});
}