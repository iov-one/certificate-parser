import { CertificateParser } from "./certificateParser";
import forge from "node-forge";
import { ERRORS } from "./errors";
import { WebCertificateV1 } from "./v1/types/webCertificateType";

// suppose we are a certifier
const generateValidWebCertificate = (): WebCertificateV1 => {
  // certifier's private and pub key
  const { publicKey, privateKey } = forge.pki.ed25519.generateKeyPair();
  const cert = {
    // look for CertificateTypes
    type: "web",
    version: 1,
    certifier: {
      id: "Example",
      public_key: `b'${publicKey.toString("hex")}'`,
      url: "https://www.example.com/publickey",
    },
    custom: {
      type: "xyz",
      registered_name: "IOV SAS",
      registred_country: "FR",
      url: "iov.one",
      registration_date: "18/06/2022",
      registered_address: "55 rue la Boetie",
      registered_city: "Paris",
    },
    starname: {
      address: "starxyz",
      starname: "*starname",
    },
    web: {
      host: "iov.one",
    },
  };
  const signature = forge.pki.ed25519.sign({
    encoding: "utf8",
    message: JSON.stringify(cert),
    privateKey,
  });
  const certificate = {
    cert,
    signature: `b'${signature.toString("hex")}'`,
  };
  // this is our final certificate
  return certificate;
};

describe("Certificate parser", () => {
  it("can be constructed", () => {
    const validWebCertificate = generateValidWebCertificate();
    expect(
      new CertificateParser(JSON.stringify(validWebCertificate))
    ).toBeTruthy();
  });

  it("throws on invalid certificate init", () => {
    const invalidStringifiedJsonCertificate = JSON.stringify({
      hello: "test",
      world: "mario's",
    });

    try {
      new CertificateParser(invalidStringifiedJsonCertificate);
    } catch (error) {
      expect((error as Error).message).toBe(ERRORS.UNSUPPORTED_STRUCTURE);
    }
  });

  it("throws on invalid version, type", () => {
    const certificateWithInvalidVersion = {
      cert: {
        type: "web",
        version: 69,
      },
      signature: "signature",
    };
    try {
      new CertificateParser(JSON.stringify(certificateWithInvalidVersion));
    } catch (error) {
      expect((error as Error).message).toBe(ERRORS.INVALID_VERSION);
    }
    // lets test with a invalid type
    const certificateWithInvalidType = {
      cert: {
        type: "some-unknown-type",
        version: 1,
      },
      signature: "signature",
    };
    try {
      new CertificateParser(JSON.stringify(certificateWithInvalidType));
    } catch (error) {
      expect((error as Error).message).toBe(ERRORS.INVALID_TYPE);
    }
  });

  it("can check integrity of a certificate", () => {
    const validWebCertificate = generateValidWebCertificate();
    const parsedCertificate = new CertificateParser(
      JSON.stringify(validWebCertificate)
    );
    expect(parsedCertificate.checkIntegrity()).toBeTruthy();

    // lets invalidate this certificate by modifying it
    const { cert, signature } = validWebCertificate;
    const { starname, ...otherProps } = cert;

    // this is a modified invalid certificate
    const modifiedCertificate: WebCertificateV1 = {
      cert: {
        ...otherProps,
        starname: {
          starname: "*exploiter",
          address: "starexploiter",
        },
      },
      signature,
    };

    const parsedModifiedCertificate = new CertificateParser(
      JSON.stringify(modifiedCertificate)
    );
    expect(parsedModifiedCertificate.checkIntegrity()).toBeFalsy();
  });

  it("allows custom fields as well", () => {
    const validWebCertificate = generateValidWebCertificate();
    const { cert, signature } = validWebCertificate;

    const customEntity = {
      type: "some type",
      something: "hello",
      business_address: "some business address",
    };
    const modifiedCertificate = {
      cert: {
        ...cert,
        custom: customEntity,
      },
      signature,
    };
    const parsed = new CertificateParser(JSON.stringify(modifiedCertificate));
    expect(parsed.getCustomEntity()).toStrictEqual(customEntity);
  });

  it("doesn't fail on providing additonal fields", () => {
    const validWebCertificate = generateValidWebCertificate();
    const { cert, signature } = validWebCertificate;

    const modifiedCertificate = {
      cert: {
        ...cert,
        additional: {
          hello: "world",
        },
      },
      signature,
    };
    expect(
      new CertificateParser(JSON.stringify(modifiedCertificate))
    ).toBeTruthy();
  });
});
