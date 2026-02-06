import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";
import { BlogIndexResponse } from "./blog-index";

export type BlogWishIndexRequest = {
  limit: number | null;
  offset: number | null;
  userId: number | null;
};

export type BlogWishIndexResponse = BlogIndexResponse;

export function blogWishIndex(
  req: BlogWishIndexRequest
): Promise<QueryResponse<BlogWishIndexResponse>> {
  return fetchApi("GET", "/blogs/wish", req);
}
