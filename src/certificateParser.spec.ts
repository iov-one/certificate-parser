import { CertV1 } from "v1/types/cert";
import { CertificateV1 } from "v1/types/certificateType";

import forge from "node-forge";
import { CertificateParser } from "certificateParser";
import { ERRORS } from "errors";

// suppose we are a certifier
const generateValidWebCertificate = (): CertificateV1 => {
  // certifier's private and pub key
  const { publicKey, privateKey } = forge.pki.ed25519.generateKeyPair();
  const cert: CertV1 = {
    type: "web_service_binding",
    version: 1,
    expire_date: "1655875716",
    certifier: {
      id: "Example",
      public_key: publicKey.toString("hex"),
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
    service: {
      // look for service type
      type: "web",
      host: "something.com",
    },
  };
  const signature = forge.pki.ed25519.sign({
    encoding: "utf8",
    message: JSON.stringify(cert),
    privateKey,
  });
  const certificate = {
    cert,
    signature: signature.toString("hex"),
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

  it("throws on invalid service entity", () => {
    const { cert, signature } = generateValidWebCertificate();
    const { service, ...otherCertProps } = cert;
    // lets create a new invalid certificate from it
    // we will modify service object to exclude host entity from it
    const certificateWithInvalidServiceEntity: CertificateV1 = {
      cert: {
        service: {
          type: "web",
        },
        ...otherCertProps,
      },
      signature,
    };

    try {
      new CertificateParser(
        JSON.stringify(certificateWithInvalidServiceEntity)
      );
    } catch (error) {
      expect((error as Error).message).toBe(
        `Invalid ${service.type} service entity`
      );
    }
  });

  it("can read expiry date of a certificate", () => {
    const validWebCertificate = generateValidWebCertificate();
    const parsedCertificate = new CertificateParser(
      JSON.stringify(validWebCertificate)
    );
    expect(parsedCertificate.getExpireDate().getDate()).toBe(22);
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
    const modifiedCertificate: CertificateV1 = {
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
    const { service, ...otherCertProps } = cert;

    const modifiedCertificate = {
      cert: {
        additional: {
          hello: "world",
        },
        service: {
          additionalServiceFields: {
            foo: "bar",
          },
          ...service,
        },
        ...otherCertProps,
      },
      signature,
    };
    expect(
      new CertificateParser(JSON.stringify(modifiedCertificate))
    ).toBeTruthy();
  });
});
