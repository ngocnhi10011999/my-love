Here is the revised, frontend-only project plan utilizing **React** for the user interface, routing, and direct integration with AWS S3 and the Telegram Bot API.

---

# Project Plan: Simple Secure Gallery with React, Fancybox & AWS S3

## 1. Project Overview

This project aims to build a lightweight, single-page application (SPA) using **React**. It features a password-gated access system that differentiates between an **Admin** and a **Guest**. The gallery is powered by the **Fancybox for React** component, rendering images fetched directly from an AWS S3 bucket.

### Tech Stack Architecture

* **Framework:** React (Vite template for optimal performance)
* **Styling:** Tailwind CSS
* **Gallery Component:** `@fancyapps/ui` (Fancybox React Wrapper)
* **Storage Provider:** AWS S3 (via `@aws-sdk/client-s3`)
* **Notification Client:** Axios / Fetch API (targeting Telegram Bot API)

---

## 2. System Flow & Component Architecture

```
                       +-------------------+
                       |    <GateComponent>|
                       | (Password Entry)  |
                       +---------+---------+
                                 |
                     Validates State & Password
                                 v
                     +-----------+-----------+
                     |   React Context / State|
                     +-----+- - - - - - -+---+
                           |             |
                     Matches Admin    Matches Guest
                           |             |
                           v             v
             +-------------+----+   +----+-------------+
             |  <AdminPanel />  |   |  <GuestView />   |
             | (Upload & View)  |   |   (View Only)    |
             +-------------+----+   +----+-------------+
                           |             |             |
                 S3 PutObject   S3 ListObjects     HTTP POST
                           |             |             |
                           v             v             v
                     +-----+-------------+----+   +----+--------+
                     |      AWS S3 Bucket     |   |Telegram Bot|
                     +------------------------+   +------------+

```

---

## 3. Component Specifications

### A. Authentication & Routing State

Since this is a client-side app with non-critical security requirements, user roles will be saved directly into React state (or `localStorage` to persist across reloads).

* `process.env.REACT_APP_ADMIN_PASSWORD`: Unlocks the upload capabilities + gallery viewer.
* `process.env.REACT_APP_GUEST_PASSWORD`: Unlocks the gallery viewer only and dispatches a silent tracking alert.

### B. AWS S3 Integration (Client-Side)

* **Read Actions:** On component mount, the app uses the AWS SDK to run `ListObjectsV2Command`, parsing image keys into structured URLs.
* **Write Actions:** The admin panel includes a file picker input that converts images into binary streams, uploading them via `PutObjectCommand`.
* *Note: The S3 Bucket must have Cross-Origin Resource Sharing (CORS) configured to accept requests from the React application's domain/localhost.*

### C. UI Component (Fancybox for React)

* Images are laid out in a responsive Tailwind grid layout.
* We construct a reusable `<Fancybox>` wrapper component to handle the binding and clean-up lifecycle methods of the Fancybox core instances.

### D. Telegram Notification Service

* Upon successful validation of the Guest password, a direct `fetch` request is dispatched to `https://api.telegram.org/bot<token>/sendMessage` notifying the channel of a viewer entry.

---

## 4. Configuration & Environment Variables

### Environment File (`.env.local`)

```env
# Credentials
VITE_ADMIN_PASSWORD=admin123
VITE_GUEST_PASSWORD=guest123

# AWS Credentials (Ensure IAM policy is highly restricted to this bucket only)
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_AWS_REGION=ap-southeast-1
VITE_AWS_S3_BUCKET=your_gallery_bucket_name

# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_CHAT_ID=your_chat_id

```

---

## 5. Implementation Roadmap (Task Breakdown)

### Phase 1: Initial Setup

* [ ] Scaffold the project using Vite: `npm create vite@latest secure-gallery -- --template react`.
* [ ] Install target dependencies:
```bash
npm install @fancyapps/ui @aws-sdk/client-s3 tailwindcss postcss autoprefixer

```


* [ ] Set up Tailwind CSS configurations.

### Phase 2: State Management & Gate View

* [ ] Create an `AuthContext` to manage the logged-in user state (`null`, `'guest'`, or `'admin'`).
* [ ] Build the `<Gate />` interface containing the password entry lock screens.
* [ ] Implement submission checks mapping passwords to their respective `.env` environment tokens.

### Phase 3: Telemetry & API Calls

* [ ] Write a `triggerTelegramAlert()` utility using native Fetch APIs.
* [ ] Tie this trigger into the successful execution block of the Guest login sequence.

### Phase 4: S3 Integration Engine

* [ ] Initialize the `S3Client` instance with the client-side credentials.
* [ ] Create an asynchronous helper function `fetchGalleryImages()` to poll the S3 endpoint and array-map target asset URLs.
* [ ] Create an `uploadImageToS3(file)` wrapper utility for the Admin control block.

### Phase 5: Fancybox Gallery Wrapper & UI Assembly

* [ ] Code the standard React Declarative Wrapper for Fancybox:
```jsx
import React, { useEffect, useRef } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function Fancybox(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const delegate = props.delegate || "[data-fancybox]";
    const options = props.options || {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  }, [props.delegate, props.options]);

  return <div ref={containerRef}>{props.children}</div>;
}
export default Fancybox;

```


* [ ] Build the primary layout viewport, mapping the retrieved S3 images array down inside the custom `<Fancybox>` tags.

---

## 6. Claude Code Review Focus Areas

When passing this JavaScript file layout to Claude for an optimization sweep, emphasize these areas:

1. **React Lifecycle Cleanups:** Ensure `Fancybox.unbind()` is safely firing to prevent heavy DOM memory leaks during high-volume component updates.
2. **Asynchronous UI States:** Check for proper handling of loading animations or disabled buttons while large files are uploading to AWS or during the initial asset fetch hook.
3. **S3 CORS Issues:** Ensure clear guidance or code configurations for handling cross-origin fetch failures in the browser console.