import { fetchApi } from "@/utils/fetch-api";
import { MutationResponse } from "../mutation-response";

export type BlogUpdateRequest = {
  title: string;
  content: string;
  tagIds: number[];
};
export function blogUpdate(id: number): Promise<MutationResponse> {
  return fetchApi("PATCH", `/blogs/${id}`);
}
