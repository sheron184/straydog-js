import { useState } from "react";
import { axiosInstance } from "@/api/config.axios";

interface RequestState {
  loading: boolean;
  error: string | null;
  data: any;
}

export function useRequest() {
  const [state, setState] = useState<RequestState>({
    loading: false,
    error: null,
    data: null
  });

  const get = async (params: any) => {
    setState({ loading: true, error: null, data: null });
    
    try {
      const response = await axiosInstance.get("", { params });
      setState({ loading: false, error: null, data: response.data });
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Unknown error";
      setState({ loading: false, error: errorMessage, data: null });
      throw new Error(errorMessage);
    }
  };

  return { ...state, get };
}