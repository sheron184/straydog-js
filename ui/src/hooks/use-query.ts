import { useState, useEffect } from "react";

// Hook to get query params as an object
export function useQueryParams() {
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    setParams(obj);
  }, [window.location.search]); // re-run if URL changes

  return params;
}
