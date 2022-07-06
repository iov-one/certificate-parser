export type SupportedCertificateTypes = "web_service_binding";
export type SupportedVersions = 1;

export interface BaseCert {
  type: SupportedCertificateTypes;
  version: SupportedVersions;
  expire_date: string;
}
