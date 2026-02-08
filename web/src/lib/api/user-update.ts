import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type UserUpdateRequest = {
  name?: string;
  iconImageId?: number;
};

export function userUpdate(req: UserUpdateRequest): Promise<MutationResponse> {
  return fetchApi("PATCH", `/auth/me`, req);
}
