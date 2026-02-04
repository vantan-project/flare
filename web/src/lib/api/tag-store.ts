import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type TagStoreRequest = {
  name: string;
};

export function tagStore(
  req: TagStoreRequest,
): Promise<MutationResponse<{ tagId: number }>> {
  return fetchApi("POST", "/tags", req);
}
