import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export function blogWhish(id: number): Promise<MutationResponse> {
  return fetchApi("POST", `/blogs/${id}/wish`);
}
