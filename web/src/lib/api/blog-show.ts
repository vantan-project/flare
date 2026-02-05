import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogShowResponse = {
  id: number;
  title: string;
  thumbnailImageUrl: string;
  user: {
    id: number;
    name: string;
    userIconUrl: string | null;
  };
  wishesCount: number;
  bookmarksCount: number;
  tags: {
    id: number;
    name: string;
  }[];
  updatedAt: string;
  content: string;
};

export function blogShow(id: number): Promise<QueryResponse<BlogShowResponse>> {
  return fetchApi("GET", `/blogs/${id}`);
}
