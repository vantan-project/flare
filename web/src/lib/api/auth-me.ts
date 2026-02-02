import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type AuthMeResponse = {
  id: number;
  name: string;
  iconImageUrl: string;
  wishesCount: number[];
  bookmarksCount: number[];
}

export function authMe(): Promise<QueryResponse<AuthMeResponse>> {
  return fetchApi("GET", "/auth/me");
}
