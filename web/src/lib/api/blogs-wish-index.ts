import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogsWishIndexRequest = {
  limit: number | null;
  offset: number | null;
};

export type BlogsWishIndexResponse = {
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

export function blogsWishIdex(
  req: BlogsWishIndexRequest
): Promise<QueryResponse<BlogsWishIndexResponse>> {
  return fetchApi("GET", "/blogs/wish", req);
}
