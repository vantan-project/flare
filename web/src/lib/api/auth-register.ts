import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type AuthRegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export function authRegister(
  req: AuthRegisterRequest,
): Promise<MutationResponse<{ accessToken: string }>> {
  return fetchApi("POST", "/auth/register", req);
}
