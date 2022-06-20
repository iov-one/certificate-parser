import baseCertificateValidator from "./baseCertificate";
import { certificateTypesMap } from "./certificateTypesMap";
import { ERRORS } from "./errors";
import { BaseCertificate } from "./types/baseCertificate";
import { CertificateTypes } from "./types/certificateTypes";
import { CertificateV1 } from "./v1/types/certificateType";
import { CertifierV1 } from "./v1/types/certifier";
import { StarnameInfoV1 } from "./v1/types/starnameInfo";
import { TwitterClaimCertificateV1 } from "./v1/types/twitterClaimCertificateType";
import { TwitterClaimInfoV1 } from "./v1/types/twitterClaimInfo";
import { WebCertificateV1 } from "./v1/types/webCertificateType";
import { WebsiteInfoV1 } from "./v1/types/websiteInfo";
import certificateValidatorV1 from "./v1/validators/certificate";
import twitterClaimCertificateValidatorV1 from "./v1/validators/twitterClaimCertificate";
import webCertificateValidatorV1 from "./v1/validators/webCertificate";
import forge from "node-forge";

export class CertificateParser {
  private rawCertificate: string;
  // can be 1, 2, ...
  private version: 1;
  private type: CertificateTypes | null = null;
  // can be of multiple versions, must enforce typeguards
  // to know correct type
  private parsedCertificate: CertificateV1;
  /**
   *
   * @param certificate - A stringified JSON certificate following
   * a valid schema. See more at: [docs.starname.me](https://docs.starname.me)
   */
  public constructor(certificate: string) {
    const parsed = JSON.parse(certificate);
    const valid = baseCertificateValidator(parsed);
    if (!valid) throw new Error(ERRORS.UNSUPPORTED_STRUCTURE);

    const certificateVersion = parsed.cert.version;
    // TODO: check here for multiple versions (in future)
    if (certificateVersion !== 1) throw new Error(ERRORS.INVALID_VERSION);

    const certificateType = parsed.cert.type;
    if (!(certificateType in certificateTypesMap))
      throw new Error(ERRORS.INVALID_TYPE);

    this.type = certificateTypesMap[certificateType];
    this.version = certificateVersion;
    this.rawCertificate = certificate;
    // parse based on version
    switch (this.version) {
      case 1:
        this.parsedCertificate = this.certificateParserV1(parsed);
    }
    // check certificate based on type else throw
    switch (this.type) {
      case CertificateTypes.Web:
        if (!webCertificateValidatorV1(this.parsedCertificate))
          throw new Error(ERRORS.INVALID_WEB_CERTIFICATE);
        break;
      case CertificateTypes.TwitterClaim:
        if (!twitterClaimCertificateValidatorV1(this.parsedCertificate))
          throw new Error(ERRORS.INVALID_TWITTER_CLAIM_CERTIFICATE);
        break;
    }
  }

  private certificateParserV1(certificate: BaseCertificate): CertificateV1 {
    if (certificateValidatorV1(certificate)) return certificate;
    throw new Error(ERRORS.INVALID_V1_CERTIFICATE);
  }

  private webParserV1(): WebCertificateV1 {
    if (webCertificateValidatorV1(this.parsedCertificate))
      return this.parsedCertificate;
    throw new Error(ERRORS.INVALID_WEB_CERTIFICATE);
  }

  private twitterClaimParser(): TwitterClaimCertificateV1 {
    if (twitterClaimCertificateValidatorV1(this.parsedCertificate))
      return this.parsedCertificate;
    throw new Error(ERRORS.INVALID_TWITTER_CLAIM_CERTIFICATE);
  }

  public checkIntegrity(): boolean {
    return forge.pki.ed25519.verify({
      message: JSON.stringify({
        ...this.parsedCertificate.cert,
      }),
      encoding: "utf8",
      signature: forge.util.hexToBytes(
        this.parsedCertificate.signature.slice(2, -1)
      ),
      publicKey: forge.util.hexToBytes(
        this.parsedCertificate.cert.certifier.public_key.slice(2, -1)
      ),
    });
  }

  public getRawCertificate(): string {
    return this.rawCertificate;
  }

  public getType(): CertificateTypes {
    if (this.type === null) throw new Error(ERRORS.IMPROPER_INIT);
    return this.type;
  }

  public getVersion(): number {
    return this.version;
  }

  public getCertificate(): CertificateV1 {
    return this.parsedCertificate;
  }

  public getCertifier(): CertifierV1 {
    return this.parsedCertificate.cert.certifier;
  }

  public getStarnameInfo(): StarnameInfoV1 {
    return this.parsedCertificate.cert.starname;
  }

  public getTwitterClaimInfo(): TwitterClaimInfoV1 | null {
    if (this.getType() !== CertificateTypes.TwitterClaim) return null;
    return this.twitterClaimParser().cert.twitter;
  }

  public getWebsiteInfo(): WebsiteInfoV1 | null {
    if (this.getType() !== CertificateTypes.Web) return null;
    return this.webParserV1().cert.web;
  }

  public getCustomEntity(): any {
    return this.parsedCertificate.cert.custom;
  }
}
