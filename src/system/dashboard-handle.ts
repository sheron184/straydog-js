import { Request, Response } from "express";
import path from "path";
import ejs from 'ejs';
import { RequestModel } from "../config/data/request.model";

function getMetrics() {
	return {
		memory: process.memoryUsage(),
		cpu: process.cpuUsage(),
		uptime: process.uptime()
	}
}

function getData() {
	const requestModel = new RequestModel('request');
	const requests = requestModel.getAll();
	return {
		requests,
		metrics: getMetrics()
	}
}

export function dashboardHnadler(req: Request, res: Response) {
	const data = getData();

	const templatePath = path.join(__dirname, "ui", "index.ejs");
	
	ejs.renderFile(templatePath, data, {}, (err, html) => {
		if (err) return res.status(500).send(err.message);
		res.send(html);
	});
}