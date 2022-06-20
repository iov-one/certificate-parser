import { CertV1 } from "./cert";
import { CertificateV1 } from "./certificateType";
import { TwitterClaimInfoV1 } from "./twitterClaimInfo";

interface CertWithTwitterClaimEntityV1 extends CertV1 {
  twitter: TwitterClaimInfoV1;
}

export interface TwitterClaimCertificateV1 extends CertificateV1 {
  cert: CertWithTwitterClaimEntityV1;
}
