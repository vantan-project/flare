import { accessToken } from "./access-token";

type apiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function fetchApi(method: apiMethod, path: string, req?: any) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const token = accessToken.get();
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  };

  if (method === "GET" || method === "DELETE") {
    options.body = undefined;
    // null/undefined/空配列を除外
    const filteredReq = Object.entries(req || {}).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const query = new URLSearchParams(filteredReq).toString();
    if (query) url += `?${query}`;
  }

  return fetch(url, options).then((res) => res.json());
}
