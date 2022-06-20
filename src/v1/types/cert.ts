import { BaseCert } from "../../types/baseCert";
import { CertifierV1 } from "./certifier";
import { StarnameInfoV1 } from "./starnameInfo";

export interface CertV1 extends BaseCert {
  starname: StarnameInfoV1;
  certifier: CertifierV1;
  custom?: any;
}
