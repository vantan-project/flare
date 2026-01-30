import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type UserUpdateRequest = {
  name?: string;
  icon?: string;
};

export function userUpdate(req: UserUpdateRequest): Promise<MutationResponse> {
  return fetchApi("PATCH", "/users", req);
}
