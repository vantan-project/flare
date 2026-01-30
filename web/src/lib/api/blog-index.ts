import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogIndexRequest = {
  orderBy: "createdAt" | "flarePoint" | "corePoint";
  limit: number | null;
  offset: number | null;
  userId: number | null;
  daysAgo: number | null;
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
