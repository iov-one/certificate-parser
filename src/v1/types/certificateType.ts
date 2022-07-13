import { BaseCertificate } from "types/baseCertificate";
import { CertV1 } from "./cert";

export interface CertificateV1 extends BaseCertificate {
  cert: CertV1;
  signature: string;
}

export const isCertificateV1 = (obj: BaseCertificate): obj is CertificateV1 => {
  return obj.cert.version === 1;
};
