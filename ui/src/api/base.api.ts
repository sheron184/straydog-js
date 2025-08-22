import { axiosInstance } from "./config.axios";

interface RequestState {
  loading: boolean;
  error: string | null;
  data: any;
}

// export async function request(params: any) {
// 	try {
// 		const response = await axiosInstance.get("", {
// 			params,
// 		});
// 		return response.data;
// 	} catch (error: any) {
// 		throw new Error(
// 			error?.response?.data?.message || error.message || "Unknown error"
// 		);
// 	}
// }

export function request() {
  let currentState: RequestState = { loading: false, error: null, data: null };
  
  return {
    async get(params: any) {
      currentState = { loading: true, error: null, data: null };
      
      try {
        const response = await axiosInstance.get("", { params });
        currentState = { loading: false, error: null, data: response.data };
        return currentState;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error.message || "Unknown error";
        currentState = { loading: false, error: errorMessage, data: null };
        return currentState;
      }
    },
    getState: () => currentState
  };
}