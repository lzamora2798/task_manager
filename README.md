# Task Manager (NestJS + Serverless + React)

## 1) Technologies Used

### Backend (API)
- **Node.js 20**
- **NestJS** (TypeScript)
- **TypeORM** (ORM)
- **JWT Authentication** with `@nestjs/jwt` and `passport-jwt`
- **bcryptjs** (password hashing / comparison; JS-only to avoid native binaries on AWS Lambda)
- **Serverless Framework v3**
- **serverless-esbuild** (bundling for AWS Lambda)

### Frontend (Web App)
- **React** + **Vite**
- **TypeScript**
- **Fetch/Axios** (depending on implementation) to call the API

### Cloud / Hosting
- **AWS Lambda** (backend compute)
- **Amazon API Gateway (HTTP API)** (public endpoints for the backend)
- **Amazon S3 Static Website Hosting** (frontend hosting)

---

## 2) Solution Overview (Architecture & Approach)

This project is split into two main components:

### A) Backend (Serverless NestJS API)
- The NestJS application runs on **AWS Lambda** using a Lambda handler (`src/lambda.ts`) that boots Nest and forwards API Gateway requests to the Nest/Express adapter.
- **API Gateway (HTTP API)** routes incoming HTTP requests to the Lambda function.
- Authentication is implemented using **JWT**:
  - `POST /login` issues a JWT token.
  - Protected endpoints under `/tasks` require a valid `Authorization: Bearer <token>` header.

### B) Frontend (React SPA)
- The frontend is a **single-page application (SPA)** built with React + Vite.
- It is hosted as static files in an **S3 bucket** with **Static Website Hosting** enabled.
- The frontend consumes the backend API via an environment variable:
  - `VITE_API_URL` (embedded during build time)

High-level flow:
