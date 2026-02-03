import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type AuthMeResponse = {
  id: number;
  name: string;
  iconImageUrl: string;
  wishedIds: number[];
  bookmarkedIds: number[];
};

export function authMe(): Promise<QueryResponse<AuthMeResponse>> {
  return fetchApi("GET", "/auth/me");
}
