import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type UserShowResponse = {
  id: number;
  name: string;
  iconImageUrl: string | null;
};

export function userShow(id: number): Promise<QueryResponse<UserShowResponse>> {
  return fetchApi("GET", `/users/${id}`);
}
