import { JSONSchemaType } from "ajv";
import ajvInstance from "./ajvInstance";
import { BaseCertificate } from "./types/baseCertificate";

export const baseCertificateSchema: JSONSchemaType<BaseCertificate> = {
  type: "object",
  properties: {
    cert: {
      type: "object",
      properties: {
        type: {
          type: "string",
        },
        version: {
          type: "number",
        },
      },
      additionalProperties: true,
      required: ["type", "version"],
    },
    signature: {
      type: "string",
    },
  },
  required: ["cert", "signature"],
};

const baseCertificateValidator = ajvInstance.compile(baseCertificateSchema);
export default baseCertificateValidator;
