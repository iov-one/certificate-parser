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
          enum: ["web_service_binding"],
        },
        version: {
          type: "number",
          enum: [1],
        },
        expire_date: {
          type: "string",
        },
      },
      additionalProperties: true,
      required: ["type", "version", "expire_date"],
    },
    signature: {
      type: "string",
    },
  },
  required: ["cert", "signature"],
};

const baseCertificateValidator = ajvInstance.compile(baseCertificateSchema);
export default baseCertificateValidator;
