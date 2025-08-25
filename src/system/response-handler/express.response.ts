import { Response } from "express";
import { ResponseModel } from "../../config/data/response.model";

export class ExpressResponseHandler {
	private response: Response;
	private responseModel: ResponseModel;
	private latency: number;
	private requestId: number;
	private error: any;

	constructor(res: Response, err: any, latency: number, requestId: number) {
		this.response = res;
		this.responseModel = new ResponseModel('response');
		this.latency = latency;
		this.requestId = requestId;
		this.error = err;
	}

	save(): number {
		const data = {
			latency: this.latency,
			end_time: (new Date()).toISOString(),
			status_code: this.response.statusCode,
			request_id: this.requestId,
			error: null,
			error_stack: null
		}
		if(this.error){
			data.error = this.error.message;
			data.error_stack = this.error.stack;
		}
		return this.responseModel.insert(data);
	}

}