import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogIndexRequest = {
  orderBy: "createdAt" | "flarePoint" | "corePoint" | "wish" | "bookmark";
  limit: number | null;
  offset: number | null;
  userId: number | null;
  daysAgo: number | null;
  tagIds: number[];
};

export type BlogIndexResponse = {
  id: number;
  title: string;
  thumbnailImageUrl: string;
  user: {
    id: number;
    name: string;
    iconImageUrl: string;
  };
  wishesCount: number;
  bookmarksCount: number;
  updateAt: string;
}[];

export function blogIndex(
  req: BlogIndexRequest
): Promise<QueryResponse<BlogIndexResponse, { total: number }>> {
  return fetchApi("GET", "/blogs", req);
}
