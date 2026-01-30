import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogIndexRequest = {
  orderBy: "createdAt" | "flarePoint" | "corePoint";
  limit: number;
  offset: number;
  userId: number;
  daysAgo: number;
};

export type BlogIndexResponse = {
  title: string;
  thumbnailImageUrl: string;
  userId: number[];
  wishesCount: number;
  tags: string[];
  updateAt: string;
}[];

export function blogIndex(): Promise<QueryResponse<{ total: number }>> {
  return fetchApi("GET", "/blogs");
}
