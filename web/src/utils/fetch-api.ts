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
    const query = new URLSearchParams(req as Record<string, any>).toString();
    if (query) url += `?${query}`;
  }

  return fetch(url, options).then((res) => res.json());
}
