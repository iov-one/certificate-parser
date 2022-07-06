import { ServiceV1 } from "./service";

export interface InstagramClaimInfoV1 {
  handle: string;
}

export interface InstagramServiceV1 extends ServiceV1 {
  handle: string;
}

export const isInstagramService = (
  value: ServiceV1
): value is InstagramServiceV1 => {
  return (
    value.type === "instagram" &&
    value.handle !== undefined &&
    typeof value.handle === "string"
  );
};
