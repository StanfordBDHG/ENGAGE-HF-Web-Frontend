<!--

This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project

SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)

SPDX-License-Identifier: MIT

-->

# Stanford Biodesign Digital Health ENGAGE-HF Web Frontend

[![Build and Test](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/build-and-test.yml)
[![Deployment](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/main.yml/badge.svg)](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/StanfordBDHG/ENGAGE-HF-Web-Frontend/graph/badge.svg?token=PsKyNz7Woe)](https://codecov.io/gh/StanfordBDHG/ENGAGE-HF-Web-Frontend)

## How To Use ENGAGE-HF Web Frontend

The ENGAGE-HF Web Frontend repository contains a Next.js project providing automated GitHub Actions and setups for code linting, testing & test coverage reports, docker deployments, a docker compose setup, local packages for modular deployment.

## Getting Started

You can run the project using the following command. You will need to install Node.js and npm, e.g., using [homebrew (recommended for macOS)](https://formulae.brew.sh/formula/node) or the official [Node.js installer](https://nodejs.org/en/download).

1. Install All Dependencies

```bash
npm install
```

2. Setup Firebase Environment Values

Create an `.env.local` file or inject the following environment variables required for the Google Firebase Setup:

```
VITE_PUBLIC_FIREBASE_API_KEY=
VITE_PUBLIC_FIREBASE_AUTH_DOMAIN=
VITE_PUBLIC_FIREBASE_PROJECT_ID=
VITE_PUBLIC_FIREBASE_STORAGE_BUCKET=
VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
VITE_PUBLIC_FIREBASE_APP_ID=
```

3. Start the Vite Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.<!-- markdown-link-check-disable-line -->

You can edit the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build the image and run the docker compose setup: `docker compose -f docker-compose-development.yml up`.

You can view the images you create with `docker images`.

Open [http://localhost](http://localhost) with your browser to see the result. You can visit [http://localhost:8080](http://localhost:8080) to see the reverse proxy setup before the main application.<!-- markdown-link-check-disable-line -->

The `docker-compose.yml` setup contains a production-ready setup using a reverse proxy.

Every version of the application on the `main` branch is automatically packaged into docker images using the `main` tag. Every release is also published using the `latest` and respective version tags.

## Deployment

This repository contains all necessary files to deploy the web frontend to Google Cloud Firebase ([Stanford mHealth Platform](https://med.stanford.edu/mhealth.html)).

### Deployment Configuration

...

### Stanford SSO Setup

The ENGAGE-HF web page uses Stanford single sign on (SSO) as a mechanism to allow clinicians and admins to log into the web page.

The [Stanford SAML and OIDC Configuration Manager](https://spdb-prod.iam.stanford.edu) needs to be configured using an OIDC configuration.
You will use the Client ID and Client secret from the configuration to set up the OIDC authentication in Firebase Authentication.

- Subject Type: `public`
- Token Endpoint Auth: `client_secret_basic`
- Grant Type: `refresh_token (authorization_code always enabled)`
- Scopes: `profile`, `email`.
- Redirect URI(s): `https://FIREBASE_PROJECT_ID.firebaseapp.com/__/auth/handler`, replacing `FIREBASE_PROJECT_ID` with your Firebase project identifier.

You will need to configure [Firebase Authentication with Identity Platform to use OpenID connect in web apps](https://firebase.google.com/docs/auth/web/openid-connect).
You need to configure the OpenID Connect Sign-in provider as follows:

- Grant Type: `Code flow`
- Name: `Stanford`
- Client ID: Client ID obtained from your OIDC configuration from the [Stanford SAML and OIDC Configuration Manager](https://spdb-prod.iam.stanford.edu).
- Issuer (URL): `https://login.stanford.edu`
- Client secret: Client ID obtained from your OIDC configuration from the [Stanford SAML and OIDC Configuration Manager](https://spdb-prod.iam.stanford.edu).

## License

This project is licensed under the MIT License. See [Licenses](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/tree/main/LICENSES) for more information.

## Contributors

This project is developed as part of the Stanford Byers Center for Biodesign at Stanford University.
See [CONTRIBUTORS.md](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/tree/main/CONTRIBUTORS.md) for a full list of all contributors.

![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-light.png#gh-light-mode-only)
![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-dark.png#gh-dark-mode-only)
