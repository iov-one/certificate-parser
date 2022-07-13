import forge from "node-forge";
import baseCertificateValidator from "./baseCertificate";
import { ERRORS } from "./errors";
import { SupportedCertificateTypes } from "./types/baseCert";
import { BaseCertificate } from "./types/baseCertificate";
import { CertificateV1 } from "./v1/types/certificateType";
import { CertifierV1 } from "./v1/types/certifier";
import { isInstagramService } from "./v1/types/instagramClaim";
import { ServiceV1, SupportedServiceTypes } from "./v1/types/service";
import { StarnameInfoV1 } from "./v1/types/starnameInfo";
import { isTwitterService, TwitterClaimInfoV1 } from "./v1/types/twitterClaim";
import { isWebService, WebsiteInfoV1 } from "./v1/types/webClaim";
import certificateValidatorV1 from "./v1/validators/certificate";

export class CertificateParser {
  private rawCertificate: string;
  private service: ServiceV1;

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

    this.rawCertificate = certificate;
    // parse based on version
    switch (parsed.cert.version) {
      case 1:
        this.parsedCertificate = this.certificateParserV1(parsed);
    }
    // set service now
    this.service = this.parsedCertificate.cert.service;
    // check certificate based on service else throw
    // because its really crucial for other methods
    if (!this.checkValidCertificateService(this.parsedCertificate)) {
      throw new Error(`Invalid ${this.service.type} service entity`);
    }
  }

  private checkValidCertificateService(certificate: CertificateV1): boolean {
    const {
      cert: { service },
    } = certificate;
    switch (service.type) {
      case "web":
        return isWebService(service);
      case "twitter":
        return isTwitterService(service);
      case "instagram":
        return isInstagramService(service);
    }
  }

  private certificateParserV1(certificate: BaseCertificate): CertificateV1 {
    if (certificateValidatorV1(certificate)) return certificate;
    throw new Error(ERRORS.INVALID_V1_CERTIFICATE);
  }

  public getRawCertificate(): string {
    return this.rawCertificate;
  }

  public getServiceType(): SupportedServiceTypes {
    return this.service.type;
  }

  public getCertificateType(): SupportedCertificateTypes {
    return this.parsedCertificate.cert.type;
  }

  public getVersion(): number {
    return this.parsedCertificate.cert.version;
  }

  public getExpireDate(): Date {
    return new Date(parseInt(this.parsedCertificate.cert.expire_date) * 1000);
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
    if (isTwitterService(this.service)) {
      return this.service;
    }
    return null;
  }

  public getWebsiteInfo(): WebsiteInfoV1 | null {
    if (isWebService(this.service)) {
      return this.service;
    }
    return null;
  }

  public getCustomEntity(): any {
    return this.parsedCertificate.cert.custom;
  }

  public checkIntegrity(): boolean {
    return forge.pki.ed25519.verify({
      message: JSON.stringify(this.parsedCertificate.cert),
      encoding: "utf8",
      signature: forge.util.hexToBytes(this.parsedCertificate.signature),
      publicKey: forge.util.hexToBytes(
        this.parsedCertificate.cert.certifier.public_key
      ),
    });
  }

  public checkValidity(): boolean {
    return this.getExpireDate() > new Date();
  }
}
