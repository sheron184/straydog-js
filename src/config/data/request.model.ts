import { BaseModel } from "./base.model";

export class RequestModel extends BaseModel {
	constructor(table: string){
		super(table);
	}
}