import { Response } from "express";
import { ResponseModel } from "../../config/data/response.model";

export class ExpressResponseHandler {
	private response: Response;
	private responseModel: ResponseModel;
	private latency: number;
	private requestId: number;

	constructor(res: Response, latency: number, requestId: number) {
		this.response = res;
		this.responseModel = new ResponseModel('response');
		this.latency = latency;
		this.requestId = requestId;
	}

	save(): number {
		const data = {
			latency: this.latency,
			end_time: (new Date()).toISOString(),
			status_code: this.response.statusCode,
			request_id: this.requestId
		}
		return this.responseModel.insert(data);
	}

}