import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export function blogWishDestroy(id: number): Promise<MutationResponse> {
  return fetchApi("DELETE", `/blogs/${id}/wish`);
}
