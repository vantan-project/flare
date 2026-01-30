import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";
import { get } from "http";

export type TagIndexResponse = {
  id: number;
  name: string;
}[];

export function tagIndex(): Promise<QueryResponse<TagIndexResponse>> {
  return fetchApi("GET", "/tags");
}
