import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export function userDestory(): Promise<MutationResponse> {
  return fetchApi("DELETE", "/users");
}
