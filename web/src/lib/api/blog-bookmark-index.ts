import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogBookmarkIndexRequest = {
  limit: number | null;
  offset: number | null;
};

export type BlogBookmarkIndexResponse = {
  id: number;
  title: string;
  thumbnailImageUrl: string;
  wishesCount: number;
  tags: string[];
  user: {
    id: number;
    name: string;
    icon: string;
  };
  updatedAt: string;
}[];

export function blogBookmarkIndex(
  req: BlogBookmarkIndexRequest
): Promise<QueryResponse<BlogBookmarkIndexResponse>> {
  return fetchApi("GET", "/blogs/bookmark", req);
}
