import { RequestModel } from "../../config/data/request.model";
import { ResponseModel } from "../../config/data/response.model";
import { getMetrics } from "../../utils/metrics.utils";

export class Api {
	private responseModel: ResponseModel;
	private requestModel: RequestModel;

	constructor() {
		this.requestModel = new RequestModel('request');
		this.responseModel = new ResponseModel('response');
	}

	requests() {
		const payload: any[] = [];

		const responses = this.responseModel.getAll();
		const requests = this.requestModel.getAll();

		const responseMap = new Map<string, any>();
		for (const resp of responses) {
			responseMap.set(resp.request_id, { ...resp });
		}

		for (const req of requests) {
			const resp = responseMap.get(req.id);
			if (resp) {
				delete resp.id;
				payload.push({
					...req,
					...resp,
				});
			}
		}

		return payload;
	}

	metrics(){
		return getMetrics();
	}
}