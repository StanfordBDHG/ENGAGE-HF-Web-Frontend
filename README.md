<!--

This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project

SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)

SPDX-License-Identifier: MIT

-->

# Stanford Biodesign Digital Health ENGAGE-HF Web Frontend

[![Build and Test](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/build-and-test.yml)
[![Deployment](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/deployment.yml/badge.svg)](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/actions/workflows/deployment.yml)
[![codecov](https://codecov.io/gh/StanfordBDHG/ENGAGE-HF-Web-Frontend/graph/badge.svg?token=PsKyNz7Woe)](https://codecov.io/gh/StanfordBDHG/ENGAGE-HF-Web-Frontend)

Web Frontend for the ENGAGE-HF project.

## Behavior

This repository provides dashboard to manage ENGAGE-HF application, for admins and clinicians. Clinicians can interact with patients, adjust their recommended medications, allergies and appointments.

## Stack

The ENGAGE-HF Web Frontend repository contains a React project built with Vite, TypeScript and Firebase. It provides automated GitHub Actions, setups for code linting, testing & test coverage reports, docker deployments, a docker compose setup.

In order to run Web Frontend, you need to use actual Firebase environment or Emulator. For developing locally, it's best to use the Emulator. Refer to ["Using the emulator for client applications" section of ENGAGE-HF-Firebase](https://github.com/StanfordBDHG/ENGAGE-HF-Firebase?tab=readme-ov-file#using-the-emulator-for-client-applications) for an instruction.

## Getting Started

This project uses Node.js v22. Install Node.js, e.g. using [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating), [homebrew (for macOS)](https://formulae.brew.sh/formula/node) or official [Node.js installer](https://nodejs.org/en/download) .

1. Install all dependencies

```bash
npm install
```

2. Setup environment variables

Refer `.env.example` file for environment variables documentation. Copy `.env.example` to `.env.local` and adjust if necessary.

3. Start the Vite Application

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build the image and run the docker compose setup: `docker compose -f docker-compose-development.yml up`.

You can view the images you create with `docker images`.

Open [http://localhost](http://localhost) with your browser to see the result. You can visit [http://localhost:8080](http://localhost:8080) to see the reverse proxy setup before the main application.

The `docker-compose.yml` setup contains a production-ready setup using a reverse proxy.

Every version of the application on the `main` branch is automatically packaged into docker images using the `main` tag. Every release is also published using the `latest` and respective version tags.

## Deployment

This repository contains all necessary files to deploy the web frontend to Google Cloud Firebase.

### Deployment Configuration

...

## License

This project is licensed under the MIT License. See [Licenses](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/tree/main/LICENSES) for more information.

## Contributors

This project is developed as part of the Stanford Byers Center for Biodesign at Stanford University.
See [CONTRIBUTORS.md](https://github.com/StanfordBDHG/ENGAGE-HF-Web-Frontend/tree/main/CONTRIBUTORS.md) for a full list of all contributors.

![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-light.png#gh-light-mode-only)
![Stanford Byers Center for Biodesign Logo](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-dark.png#gh-dark-mode-only)
