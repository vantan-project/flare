import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export function blogBookmarkDestroy(id: number): Promise<MutationResponse> {
  return fetchApi("DELETE", `/blogs/${id}/bookmark`);
}
