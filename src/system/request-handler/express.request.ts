import { Request } from "express";
import { RequestModel } from "../../config/data/request.model";
import { iOptions } from "../../types/request.types";

export class ExpressRequestHandler {
	private request: Request;
	private requestModel: RequestModel;
	private options: iOptions;
	public excluded: boolean = false;

	constructor(req: Request, options: iOptions) {
		this.request = req;
		this.requestModel = new RequestModel('request');
		this.options = options;

		this.excluded = this.checkIfExcluded();
	}

	checkIfExcluded() : boolean {
		return this.options.exclude.includes(this.getPath());
	}

	save(): number {
		const data = {
			method: this.getMethod(),
			path: this.getPath(),
			headers: this.getHeaders(),
			query: this.getQuery(),
			start_time: (new Date()).toISOString()
		}
		return this.requestModel.insert(data);
	}

	getPath() {
		return this.request.path;
	}

	getMethod() {
		return this.request.method;
	}

	getQuery() {
		return JSON.stringify(this.request.query);
	}

	getHeaders() {
		return this.request.headers.toString();
	}
}