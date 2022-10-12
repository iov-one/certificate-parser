# @iov/certificate-parser [![npm version](https://img.shields.io/npm/v/axios.svg?style=flat-square)](https://www.npmjs.org/package/axios)  

Allows to easily parse and use certificates supported by Starname blockchain.

## Installation  

```bash
yarn add @iov/certificate-parser
```

## Usage  

```ts
import { CertificateParser } from "certificate-parser";

// this throws on invalid certificate
const parsedCertificate = new CertificateParser("stringifiedJSONCertificate");
parsedCertificate.getStarnameInfo();

// Output
{
    starname: "*starname",
    address: "staraddress..."
}
```
