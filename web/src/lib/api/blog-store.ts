import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type BlogStoreRespnse = {
  title: string;
  content: string;
  tagIds: number[];
  thumbnailImageId: number;
};

export function blogStore(
  req: BlogStoreRespnse,
): Promise<MutationResponse<{ blogId: string }>> {
  return fetchApi("POST", "/blogs", req);
}
