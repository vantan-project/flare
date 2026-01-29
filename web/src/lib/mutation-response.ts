export type MutationResponse<T extends object> =
  | (T & {
      status: "success";
      message: string;
    })
  | { status: "error"; message: string }
  | {
      status: "validation";
      fieldErrors: Record<string, string>;
    };
