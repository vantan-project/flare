import { fetchApi } from "@/utils/fetch-api";
import { QueryResponse } from "../query-response";

export type BlogShowResponse = {
  title: string;
  thumbnailImageUrl: string;
  userId: number[];
  wishesCount: number;
  tags: string[];
  updateAt: string;
};

export function blogshow(
  id: number,
): Promise<QueryResponse<{ BlogShowResponse: string }>> {
  return fetchApi("GET", `/blogs/${id}`);
}
