import { accessToken } from "@/utils/access-token";
import { MutationResponse } from "../mutation-response";

export type ImageStoreRequest = {
  image: File;
};

export function imageStore(req: ImageStoreRequest): Promise<
  MutationResponse<{
    imageId: number;
    imageUrl: string;
  }>
> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/images`;
  const token = accessToken.get();

  const form = new FormData();
  form.append("image", req.image);

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  }).then((res) => res.json());
}
