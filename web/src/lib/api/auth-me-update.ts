import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type AuthMeUpdateRequest = {
  name?: string;
  iconImageId?: number;
};

export function authMeUpdate(
  req: AuthMeUpdateRequest,
): Promise<MutationResponse> {
  return fetchApi("PATCH", "/auth/me", req);
}
