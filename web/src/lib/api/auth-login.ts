import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export function authLogin(
  req: AuthLoginRequest
): Promise<MutationResponse<{ accessToken: string }>> {
  return fetchApi("POST", "/auth/login", req);
}
