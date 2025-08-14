export interface BaseAppHandlerInterface {
	init(app: any) : any;
	getRouteList(app: any) : any;
}

export class BaseAppHandler {
	private handler: BaseAppHandlerInterface;

	constructor(handler: BaseAppHandlerInterface){
		this.handler = handler;
	}

	getRouteList(app: any){
		this.handler.getRouteList(app);
	}

	init(app: any) {
		this.handler.init(app);
	}
}