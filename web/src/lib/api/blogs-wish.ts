import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogsWishRequest = {
  limit: number[];
  offset: number[];
};
export type BlogsWishResponse = {
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

export function blogsWish(
  req: BlogsWishRequest
): Promise<QueryResponse<BlogsWishResponse>> {
  return fetchApi("GET", "/blogs/wish", req);
}
