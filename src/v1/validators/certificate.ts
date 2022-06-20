import { JSONSchemaType } from "ajv";
import ajvInstance from "../../ajvInstance";
import { CertificateV1 } from "../types/certificateType";

const certificateSchemaV1: JSONSchemaType<CertificateV1> = {
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
        certifier: {
          type: "object",
          properties: {
            id: { type: "string" },
            public_key: { type: "string" },
            url: { type: "string" },
          },
          additionalProperties: true,
          required: ["url", "id", "public_key"],
        },
        starname: {
          type: "object",
          properties: {
            address: { type: "string" },
            starname: { type: "string" },
          },
          required: ["address", "starname"],
        },
        custom: {
          type: "object",
          nullable: true,
        },
      },
      additionalProperties: true,
      required: ["type", "version", "certifier", "starname"],
    },
    signature: {
      type: "string",
    },
  },
  required: ["cert", "signature"],
};

const certificateValidatorV1 = ajvInstance.compile(certificateSchemaV1);
export default certificateValidatorV1;
