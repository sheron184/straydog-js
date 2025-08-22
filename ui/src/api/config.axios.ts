import axios from "axios"

export const axiosInstance = axios.create({
	baseURL: "http://localhost:7111/straydog/api"
});
