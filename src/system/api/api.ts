import { Application } from "express";
import { RequestModel } from "../../config/data/request.model";
import { ResponseModel } from "../../config/data/response.model";
import { getMetrics } from "../../utils/metrics.utils";
import { expressListEndpoints } from "../../utils/express.utils";

/**
 * Sample response structure:
 * {
		"id": 5,
		"method": "GET",
		"path": "/zama",
		"query": "{}",
		"body": null,
		"headers": "[object Object]",
		"start_time": "2025-08-14T06:36:04.070Z",
		"request_id": 5,
		"end_time": "2025-08-14T06:36:04.088Z",
		"status_code": 304,
		"error": null,
		"latency": 24.9306,
		"error_stack": null
	},
 */

export class Api {
	private responseModel: ResponseModel;
	private requestModel: RequestModel;
	private days: number;

	constructor(days: number) {
		this.requestModel = new RequestModel('request');
		this.responseModel = new ResponseModel('response');
		this.days = days;
	}

	requests() {
		const requests = this.getRequests();

		return {
			status: "OK",
			data: {
				requests,
				stats: this.getStats(requests),
			}
		};
	}

	getErrorRequests(){
		const apiRequests = this.getRequests().filter(r => !this.isStaticFileOrIgnored(r.path));
		return apiRequests.filter((r) => r.status_code >= 400);
	}

	getRequests() {
		const requestLogs: any[] = [];

		const responses = this.responseModel.getAll();
		const requests = this.requestModel.getLastNDays('start_time', this.days);

		const responseMap = new Map<string, any>();
		for (const resp of responses) {
			responseMap.set(resp.request_id, { ...resp });
		}

		for (const req of requests) {
			const resp = responseMap.get(req.id);
			if (resp) {
				delete resp.id;
				requestLogs.push({
					...req,
					...resp,
				});
			}
		}

		return requestLogs;
	}

	// Helper function to check if request is a static file or should be ignored
	private isStaticFileOrIgnored(path: string): boolean {
		if (!path) return false;
		
		// Ignore Chrome DevTools requests
		if (path.includes('.well-known/appspecific/com.chrome.devtools')) return true;
		
		// Common static file extensions
		const staticExtensions = ['.js', '.css', '.html', '.htm', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip', '.txt'];
		const lowerPath = path.toLowerCase();
		
		return staticExtensions.some(ext => lowerPath.endsWith(ext));
	}

	/*
		Requests analytics are generated here.
	*/
	getStats(requestLogs: any[] | null = null) {
		if (!requestLogs) {
			requestLogs = this.getRequests();
		}

		// Filter for API requests only (exclude static files and ignored requests)
		const apiRequests = requestLogs.filter(r => !this.isStaticFileOrIgnored(r.path));

		// Filter out requests with zero latency (errors) from API requests
		const validLatencyRequests = apiRequests.filter(r => r.latency > 0);

		return {
			count: apiRequests.length,
			failedCount: apiRequests.filter((r) => r.status_code >= 400).length,
			// successCount: apiRequests.filter((r) => r.status_code < 400).length,
			averageLatency: validLatencyRequests.length > 0 ? 
				(validLatencyRequests.reduce((acc, r) => acc + r.latency, 0) / validLatencyRequests.length).toFixed(2) : 0,
			successRate: apiRequests.length > 0 ? ((apiRequests.filter((r) => r.status_code < 400).length / apiRequests.length) * 100).toFixed(2) : 0,
			// failureRate: apiRequests.length > 0 ? ((apiRequests.filter((r) => r.status_code >= 400).length / apiRequests.length) * 100).toFixed(2) : 0,
			mostFailedEndpoint: (() => {
				const failuresByEndpoint = apiRequests.reduce((acc: Record<string, number>, r) => {
					const key = `${r.method} ${r.path}`;
					acc[key] = (acc[key] || 0) + (r.status_code >= 400 ? 1 : 0);
					return acc;
				}, {});
				let maxEndpoint: string | null = null;
				let maxFailures = -1;
				for (const [endpoint, failures] of Object.entries(failuresByEndpoint)) {
					if (failures > maxFailures) {
						maxFailures = failures;
						maxEndpoint = endpoint;
					}
				}
				return maxEndpoint;
			})(),
			highestTraffic: (() => {
				const requestsByEndpoint = apiRequests.reduce((acc: Record<string, number>, r) => {
					const key = `${r.method} ${r.path}`;
					acc[key] = (acc[key] || 0) + 1;
					return acc;
				}, {});
	
				let mostRequestedEndpoint: string | null = null;
				let maxRequests = -1;
				for (const [endpoint, count] of Object.entries(requestsByEndpoint)) {
					if (count > maxRequests) {
						maxRequests = count;
						mostRequestedEndpoint = endpoint;
					}
				}
	
				return mostRequestedEndpoint ? {
					endpoint: mostRequestedEndpoint,
					count: maxRequests
				} : null;
			})(),
			mostSuccessfulEndpoint: (() => {
				const successesByEndpoint = apiRequests.reduce((acc: Record<string, number>, r) => {
					const key = `${r.method} ${r.path}`;
					acc[key] = (acc[key] || 0) + (r.status_code < 400 ? 1 : 0);
					return acc;
				}, {});
				let maxEndpoint: string | null = null;
				let maxSuccesses = -1;
				for (const [endpoint, successes] of Object.entries(successesByEndpoint)) {
					if (successes > maxSuccesses) {
						maxSuccesses = successes;
						maxEndpoint = endpoint;
					}
				}
				return maxEndpoint;
			})(),
			slowestEndpoint: (() => {
				const latencyByEndpoint = validLatencyRequests.reduce((acc: Record<string, { total: number, count: number }>, r) => {
					const key = `${r.method} ${r.path}`;
					if (!acc[key]) {
						acc[key] = { total: 0, count: 0 };
					}
					acc[key].total += r.latency;
					acc[key].count += 1;
					return acc;
				}, {});
				
				let slowestEndpoint: string | null = null;
				let maxAvgLatency = -1;
				for (const [endpoint, data] of Object.entries(latencyByEndpoint)) {
					const avgLatency = data.total / data.count;
					if (avgLatency > maxAvgLatency) {
						maxAvgLatency = avgLatency;
						slowestEndpoint = endpoint;
					}
				}
				
				return slowestEndpoint ? {
					endpoint: slowestEndpoint,
					averageLatency: maxAvgLatency.toFixed(2)
				} : null;
			})(),
			fastestEndpoint: (() => {
				const latencyByEndpoint = validLatencyRequests.reduce((acc: Record<string, { total: number, count: number }>, r) => {
					const key = `${r.method} ${r.path}`;
					if (!acc[key]) {
						acc[key] = { total: 0, count: 0 };
					}
					acc[key].total += r.latency;
					acc[key].count += 1;
					return acc;
				}, {});
				
				let fastestEndpoint: string | null = null;
				let minAvgLatency = Infinity;
				for (const [endpoint, data] of Object.entries(latencyByEndpoint)) {
					const avgLatency = data.total / data.count;
					if (avgLatency < minAvgLatency) {
						minAvgLatency = avgLatency;
						fastestEndpoint = endpoint;
					}
				}
				
				return fastestEndpoint ? {
					endpoint: fastestEndpoint,
					averageLatency: minAvgLatency.toFixed(2)
				} : null;
			})(),
			latencyStats: {
				average: validLatencyRequests.length > 0 ? 
					validLatencyRequests.reduce((acc, r) => acc + r.latency, 0) / validLatencyRequests.length : 0,
				min: validLatencyRequests.length > 0 ? Math.min(...validLatencyRequests.map(r => r.latency)) : 0,
				max: validLatencyRequests.length > 0 ? Math.max(...validLatencyRequests.map(r => r.latency)) : 0,
			}
		}
	}

	metrics() {
		return getMetrics();
	}

	getEndpoints(app: Application, requests: any[] | undefined = undefined) {
		if(!requests){
			requests = this.getRequests();
		}
		let endpoints = expressListEndpoints(app, '');
		endpoints = endpoints.filter((e) => e.path != '/straydog/api');
		return endpoints.map((e) => {
			return {
				...e,
				total: requests.filter((r) => r.path == e.path).length,
				failed: requests.filter((r) => r.path == e.path && r.status_code >= 400).length,
				success: requests.filter((r) => r.path == e.path && r.status_code < 400).length,
			}
		})
	}
}