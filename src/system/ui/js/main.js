import { Api } from "../../api/api";

const api = new Api();

const func = {
	getRequests: () => {
		return api.requests();
	},
	loadContent: async () => {
		const params = new URLSearchParams(window.location.search);
		const body = document.getElementById("app");
		
		const page = params.get('p') || "home";
		const html = await fetch(`/monitoring/${page}`);

		body.innerHTML = "";
		body.innerHTML = html;
	}
};


function init() {
	func.loadContent();
}

init();