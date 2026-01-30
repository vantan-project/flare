import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type BlogUpdateRequest = {
  title: string;
  content: string;
  tagids: number[];
};
export function blogupdate(id: number): Promise<MutationResponse> {
  return fetchApi("PATCH", `/blogs/${id}/update`);
}
