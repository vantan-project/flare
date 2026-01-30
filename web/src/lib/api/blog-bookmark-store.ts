import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export function blogBookmarkStore(id: number): Promise<MutationResponse> {
  return fetchApi("POST", `/blogs/${id}/bookmark`);
}
