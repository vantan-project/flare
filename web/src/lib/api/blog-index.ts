import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogIndexRequest = {
  orderBy: "createdAt" | "flarePoint" | "corePoint" | "wish" | "bookmark";
  limit: number | null;
  offset: number | null;
  userId: number | null;
  daysAgo: number | null;
};

export type BlogIndexResponse = {
  id : number;
  title: string;
  thumbnailImageUrl: string;
  user: {
    id: number;
    name: string;
    iconImageUrl: string;
  };
  tags: {
    id: number;
    name: string;
  }[]
  wishesCount: number;
  bookmarksCount: number;
  updateAt: string;
}[];

export function blogIndex(): Promise<QueryResponse<{ total: number }>> {
  return fetchApi("GET", "/blogs");
}
