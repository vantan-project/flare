import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogsBookmarkRequest = {
  limit: number[];
  offset: number[];
};

export type BlogsBookmarkResponse = {
  id: number[];
  title: string;
  thumbnail: string;
  like: number;
  tags: string[];
  user: {
    id: number;
    name: string;
    icon: string;
  };
  updatedAt: number[];
}[];

export function blogsBookmark(
  req: BlogsBookmarkRequest
): Promise<QueryResponse<BlogsBookmarkResponse>> {
  return fetchApi("GET", "/blogs/bookmark", req);
}
