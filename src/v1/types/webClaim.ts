import { ServiceV1 } from "./service";

export interface WebsiteInfoV1 {
  host: string;
}

export interface WebServiceV1 extends ServiceV1 {
  host: string;
}

export const isWebService = (value: ServiceV1): value is WebServiceV1 => {
  return (
    value.type === "web" &&
    value.host !== undefined &&
    typeof value.host === "string"
  );
};
