import { CertV1 } from "./cert";
import { CertificateV1 } from "./certificateType";
import { WebsiteInfoV1 } from "./websiteInfo";

export interface CertWithWebEntityV1 extends CertV1 {
  web: WebsiteInfoV1;
}

export interface WebCertificateV1 extends CertificateV1 {
  cert: CertWithWebEntityV1;
}
