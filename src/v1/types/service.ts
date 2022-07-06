export type SupportedServiceTypes = "web" | "twitter" | "instagram";

interface ServiceEntity {
  [key: string]: string;
}

export interface ServiceV1 extends ServiceEntity {
  type: SupportedServiceTypes;
}
