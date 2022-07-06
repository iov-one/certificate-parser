import { BaseCert } from "types/baseCert";
import { CertifierV1 } from "./certifier";
import { ServiceV1 } from "./service";
import { StarnameInfoV1 } from "./starnameInfo";

export interface CertV1 extends BaseCert {
  starname: StarnameInfoV1;
  certifier: CertifierV1;
  service: ServiceV1;
  custom?: any;
}
