import { CertificateTypes } from "./types/certificateTypes";

export const certificateTypesMap: { [key: string]: CertificateTypes } = {
  web: CertificateTypes.Web,
  "twitter-claim": CertificateTypes.TwitterClaim,
};
