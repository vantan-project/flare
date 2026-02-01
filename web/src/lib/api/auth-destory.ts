import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export function authDestory(): Promise<MutationResponse> {
  return fetchApi("DELETE", "/auth");
}
