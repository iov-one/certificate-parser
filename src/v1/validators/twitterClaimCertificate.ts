import { JSONSchemaType } from "ajv";
import ajvInstance from "../../ajvInstance";
import { TwitterClaimCertificateV1 } from "../types/twitterClaimCertificateType";

const twitterClaimCertificateV1: JSONSchemaType<TwitterClaimCertificateV1> = {
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
        twitter: {
          type: "object",
          properties: {
            handle: { type: "string" },
          },
          required: ["handle"],
        },
        custom: {
          type: "object",
          nullable: true,
        },
      },
      additionalProperties: true,
      required: ["certifier", "starname", "twitter"],
    },
    signature: {
      type: "string",
    },
  },
  required: ["cert", "signature"],
};

const twitterClaimCertificateValidatorV1 = ajvInstance.compile(
  twitterClaimCertificateV1
);
export default twitterClaimCertificateValidatorV1;
