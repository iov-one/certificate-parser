import { JSONSchemaType } from "ajv";
import ajvInstance from "../../ajvInstance";
import { WebCertificateV1 } from "../types/webCertificateType";

const webCertificateSchemaV1: JSONSchemaType<WebCertificateV1> = {
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
        web: {
          type: "object",
          properties: {
            host: { type: "string" },
          },
          additionalProperties: true,
          required: ["host"],
        },
        custom: {
          type: "object",
          nullable: true,
        },
      },
      additionalProperties: true,
      required: ["type", "version", "certifier", "starname", "web"],
    },
    signature: {
      type: "string",
    },
  },
  required: ["cert", "signature"],
};

const webCertificateValidatorV1 = ajvInstance.compile(webCertificateSchemaV1);
export default webCertificateValidatorV1;
