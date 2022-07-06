import { ServiceV1 } from "./service";

export interface TwitterClaimInfoV1 {
  handle: string;
}

export interface TwitterServiceV1 extends ServiceV1 {
  handle: string;
}

export const isTwitterService = (value: ServiceV1): value is TwitterServiceV1 => {
  return (
    value.type === "twitter" &&
    value.handle !== undefined &&
    typeof value.handle === "string"
  );
};