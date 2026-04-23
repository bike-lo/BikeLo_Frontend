# Bike-Lo Frontend API Documentation

This document describes all the API endpoints used in the Bike-Lo Frontend application (`src/services/`). For each endpoint, you will find the **URL**, **Method**, and details on **Data Mapping**—specifically how TypeScript interfaces map directly into the request payloads and how responses are parsed back for the UI.

## Table of Contents
1. [Core Architecture & Parsing](#core-architecture--parsing)
2. [Auth & User Service](#1-auth--user-service)
3. [Bike Inventory Service](#2-bike-inventory-service)
4. [Sell Bike Requests](#3-sell-bike-requests)
5. [Sell Listings](#4-sell-listings)
6. [Spare Parts Catalog](#5-spare-parts-catalog)

---

## Core Architecture & Parsing

* **Base Configuration (`src/lib/api.ts`)**: Base URL relies on `VITE_API_URL` (fallback `https://backend.bike-lo.com`).
* **fetchWithAuth**: Injects `Authorization: Bearer <token>` from `localStorage` into request headers.
* **Response Mapping (`parseJson<T>`)**: Each service locally implements `parseJson<T>`, taking a standard web `Response`, attempting to parse it as JSON, and explicitly typing the output as `Promise<T>`.

---

## 1. Auth & User Service
**File:** `src/services/authService.ts`

### Signup
* **URL:** `/auth/signup`
* **Method:** `POST`
* **Data Mapping:** Takes a `SignupRequest` interface and manually constructs a JSON body:
  ```json
  {
    "name": payload.name,
    "email": payload.email,
    "password": payload.password,
    "phone": payload.phone ?? "",         // Defaults to empty string
    "role": payload.role ?? "user",       // Defaults to user
    "status": payload.status ?? "active"  // Defaults to active
  }
  ```
  Returns `Promise<TokenResponse>`.

### Login
* **URL:** `/auth/login`
* **Method:** `POST`
* **Data Mapping:** Takes `email` and `password` strings and maps to a JSON body `{ email, password }`. Returns `Promise<TokenResponse>`.

### Refresh Token
* **URL:** `/auth/refresh`
* **Method:** `POST`
* **Data Mapping:** Grabs the refresh token from `localStorage` using `getRefreshToken()` and sends `{ refresh_token: refresh }`. Upon a successful response, calls `setTokens()` to persist the new token set automatically. Returns `TokenResponse`.

### Verify OTP
* **URL:** `/auth/verify-otp`
* **Method:** `POST`
* **Data Mapping:** Maps `email` and `otp` into JSON: `{ "email": email, "verify-otp": otp }`. Returns a string message confirming verification.

### Get Current User Profile (Me)
* **URL:** `/auth/me`
* **Method:** `GET`
* **Data Mapping:** No payload. Heavily relies on `fetchWithAuth`. Returns `Promise<UserResponse>`.

### Forgot & Reset Password
* **Forgot Password** -> **URL:** `/auth/forgot-password` | **Method:** `POST` | **Mapping:** Sends `ForgotPasswordRequest` JSON.
* **Reset Password** -> **URL:** `/auth/reset-password` | **Method:** `POST` | **Mapping:** Sends `ResetPasswordRequest` JSON.

### User Management (Admin)
* **List Users** -> **URL:** `/auth/admin/users` | **Method:** `GET` | **Mapping:** Returns `Promise<UserResponse[]>`.
* **Update Role** -> **URL:** `/auth/admin/users/{userId}/role` | **Method:** `PATCH` | **Mapping:** Translates `UpdateRoleRequest` into JSON.
* **Create User** -> **URL:** `/users` | **Method:** `POST` | **Mapping:** Translates `CreateUserRequest` into JSON. Returns `UserResponse`.
* **Update User** -> **URL:** `/users/{userId}` | **Method:** `PATCH` | **Mapping:** Translates `UpdateUserRequest` into JSON. Returns `UserResponse`.
* **Delete User** -> **URL:** `/users/{userId}` | **Method:** `DELETE` | **Mapping:** No body request.

---

## 2. Bike Inventory Service
**File:** `src/services/bikeService.ts`

### UI Data Mapping (Response to UI Component)
The `bikeService.ts` includes a specific mapping utility to convert raw backend variables into human-friendly formatting for the React rendering engine:
* **Function:** `mapBikeResponseToBike(b: BikeResponse): Bike`
* **Data Mapping Logic:**
  * `brand` gets mapped from `b.make`
  * `model` gets mapped from `b.model_name`
  * `price` gets divided by `100,000` (`Number(b.price) / 100_000`) for visual presentation.
  * `emi` is calculated dynamically as `Math.round(Number(b.price) / 60)`.
  * `kmsDriven` gets mapped from `b.km_driven`
  * `isAd` converts the `b.is_ad` boolean, also enforcing ads if `b.make === 'N/A'`.
  * `imageUrl` is pre-formatted with `bikeImageUrl()` to ensure the string begins with backend `API_BASE` if it isn't an absolute path.

### List all Bikes
* **URL:** `/bikes/`
* **Method:** `GET`
* **Data Mapping:** Returns a raw `Promise<BikeResponse[]>`. Downstream UI components then map this array using `mapBikeResponseToBike()`.

### Create Bike
* **URL:** `/bikes/`
* **Method:** `POST`
* **Data Mapping:** Uses the `multipart/form-data` interface natively without explicit JSON JSON.stringify mapping. The components pass fully formatted standard HTML `FormData` variables to this function, capturing image binaries. Returns `BikeResponse`.

### Update Bike (JSON Payload)
* **URL:** `/bikes/{bikeId}`
* **Method:** `PUT`
* **Data Mapping:** Uses an `UpdateBikeRequest` TypeScript interface and stringifies it as a standard Web `application/json` payload constraint.

### Update Bike (FormData Payload)
* **URL:** `/bikes/{bikeId}`
* **Method:** `PUT`
* **Data Mapping:** Method allows replacing bike image binary data via standard `FormData` without specific headers (browsers attach boundary limits internally for `multipart/form-data`).

### Capture Lead (Enquiry / Book Now)
* **URL:** `/leads/capture`
* **Method:** `POST`
* **Data Mapping:** Binds the `LeadCapturePayload` interface directly to JSON context, sending `email`, `subject`, `UserHTML`, and `AdminHTML`.

### Delete Bike
* **URL:** `/bikes/{bikeId}`
* **Method:** `DELETE`

---

## 3. Sell Bike Requests
**File:** `src/services/sellBikeService.ts`

### Submit Sell Bike Application
* **URL:** `/sell-bikes/`
* **Method:** `POST`
* **Data Mapping:** Passes raw `FormData` arguments directly to support image and file attachments inside the browser's form submission state. Returns a `Promise<SellBikeResponse>`.

---

## 4. Sell Listings
**File:** `src/services/sellListingService.ts`

### Create Simple Sell Listing
* **URL:** `/sell-listings/`
* **Method:** `POST`
* **Data Mapping:** Assumes a raw `application/json` REST pattern. Types inputs via `SellListingRequest` (e.g. model, year, owners) and performs `JSON.stringify(data)`. Returns `Promise<SellListingResponse>`.

---

## 5. Spare Parts Catalog
**File:** `src/services/sparePartService.ts`

### Image URL Configuration Mapping
* **Function:** `sparePartImageUrl()` correctly structures absolute paths ensuring broken images display properly by linking them behind `API_BASE`.

### Endpoints
* **Get Spare Parts** -> **URL:** `/spare-parts/` | **Method:** `GET` | **Mapping:** Consumes and translates raw response into an array format `Promise<SparePartResponse[]>`.
* **Create Spare Part** -> **URL:** `/spare-parts/` | **Method:** `POST` | **Mapping:** Transmits images and string primitives seamlessly via a `FormData` object constraint, leveraging `multipart/form-data`.
* **Update Spare Part** -> **URL:** `/spare-parts/{partId}` | **Method:** `PUT` | **Mapping:** Follows the same dynamic architecture as generic update schemas but transmits binary payload via `FormData`.
* **Delete Spare Part** -> **URL:** `/spare-parts/{partId}` | **Method:** `DELETE`
