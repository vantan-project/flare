import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type BlogStoreRespnse = {
  title: string;
  content: string;
  tagsIds: number[];
  thumbnailImageId: number;
};

export function blogStore(
  req: BlogStoreRespnse,
): Promise<MutationResponse<{ BlogId: string }>> {
  return fetchApi("POST", "/blogs", req);
}
