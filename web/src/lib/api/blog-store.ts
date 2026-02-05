import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type BlogStoreRequest = {
  title: string;
  content: string;
  tagIds: number[];
  thumbnailImageId: number;
};

export function blogStore(
  req: BlogStoreRequest,
): Promise<MutationResponse<{ blogId: string }>> {
  return fetchApi("POST", "/blogs", req);
}
