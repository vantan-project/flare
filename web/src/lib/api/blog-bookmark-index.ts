import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";
import { BlogIndexResponse } from "./blog-index";

export type BlogBookmarkIndexRequest = {
  limit: number | null;
  offset: number | null;
  userId: number | null;
};

export type BlogBookmarkIndexResponse = BlogIndexResponse;

export function blogBookmarkIndex(
  req: BlogBookmarkIndexRequest
): Promise<QueryResponse<BlogBookmarkIndexResponse>> {
  return fetchApi("GET", "/blogs/bookmark", req);
}
