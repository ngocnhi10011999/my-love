Here is a comprehensive Project Plan tailored for a software development workflow. Since this documentation will be used for a Claude code review and subsequent implementation, it is structured with clear specifications, data flows, and task breakdowns.

---

# Project Plan: Simple Secure Gallery with Fancybox & AWS S3

## 1. Project Overview

This project aims to build a lightweight, secure web application to showcase an image gallery using **Fancybox**. The application features a single password-based gate entry that differentiates between an **Admin** (who can upload images directly to AWS S3) and a **Guest** (who can only view the gallery). Additionally, Guest logins will trigger a real-time notification to a **Telegram Bot**.

### Tech Stack Architecture

* **Backend:** Python / Django (Robust handling of S3 configurations and Telegram API requests)
* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, **Fancybox v4/v5** (UI Component)
* **Storage:** AWS S3 (Simple Storage Service)
* **Notifications:** Telegram Bot API

---

## 2. System Flow & Architecture

```
                       +-------------------+
                       |    Gate View      |
                       | (Password Entry)  |
                       +---------+---------+
                                 |
                        Submits Password
                                 v
                     +-----------+-----------+
                     |  Auth / Role Checker  |
                     +-----+- - - - - - -+---+
                           |             |
                     Matches Admin    Matches Guest
                           |             |
                           v             v
             +-------------+----+   +----+-------------+
             |    Admin Panel   |   |   Guest View     |
             | (Upload & View)  |   |   (View Only)    |
             +-------------+----+   +----+-------------+
                           |             |             |
                    Uploads to S3   Fetches URLs   Triggers Alert
                           |             |             |
                           v             v             v
                     +-----+-------------+----+   +----+--------+
                     |      AWS S3 Bucket     |   |Telegram Bot|
                     +------------------------+   +------------+

```

---

## 3. Component Specifications

### A. Authentication Logic (Hardcoded / Non-Critical)

Since data security is non-critical, credentials can be securely managed via environment variables (`.env`) rather than a database table.

* `ADMIN_PASSWORD`: Grants access to the Upload + View interface.
* `GUEST_PASSWORD`: Grants access to the View-only interface.

### B. Storage (AWS S3)

* Images are uploaded directly to a dedicated S3 bucket.
* The application fetches the list of object URLs from S3 to render the gallery dynamically.

### C. UI Component (Fancybox)

* Implements a clean grid layout for thumbnail previews.
* Triggers the Fancybox lightbox component upon clicking any thumbnail, enabling smooth navigation, zooming, and full-screen slideshows.

### D. Notification System (Telegram Bot)

* When a user successfully validates as a Guest, the backend dispatches an asynchronous `POST` request to the Telegram Bot API.
* **Message Template:** `🔔 Notification: A guest has logged in to view the photo gallery at [Timestamp].`

---

## 4. Database & Configuration Design

### Environment Variables (`.env`)

```env
# Access Control
ADMIN_PASSWORD=admin123
GUEST_PASSWORD=guest123

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_STORAGE_BUCKET_NAME=your_gallery_bucket_name
AWS_S3_REGION_NAME=ap-southeast-1

# Telegram Notification Configuration
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_channel_or_chat_id

```

### Django Models (Optional/Minimal)

If tracking metadata (like upload timestamps or custom titles) is preferred, use this minimal model. Otherwise, the app can read directly from the S3 bucket.

```python
from django.db import models

class GalleryImage(models.Model):
    image_url = models.URLField(max_index_length=500)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

```

---

## 5. Implementation Roadmap (Task Breakdown)

### Phase 1: Environment Setup & Project Initialization

* [ ] Initialize Django project and application layout.
* [ ] Configure `settings.py` to parse environment variables using `django-environ`.
* [ ] Install dependencies: `boto3`, `requests`, `django-storages` (optional, or write a custom S3 utility).

### Phase 2: Authentication & Gate View

* [ ] Create `GateView` containing a single password input field.
* [ ] Implement backend validation logic:
* If input matches `ADMIN_PASSWORD` $\rightarrow$ Set session key `role = 'admin'` $\rightarrow$ Redirect to `/gallery/`.
* If input matches `GUEST_PASSWORD` $\rightarrow$ Set session key `role = 'guest'` $\rightarrow$ Trigger Telegram Alert service $\rightarrow$ Redirect to `/gallery/`.
* Else $\rightarrow$ Return validation error.



### Phase 3: Telegram Alert Service

* [ ] Create a utility function `send_telegram_notification()`.
* [ ] Use `requests.post` to hit `https://api.telegram.org/bot<token>/sendMessage`.

### Phase 4: AWS S3 Core Services

* [ ] Create an `S3Service` class using `boto3` to handle:
* `upload_image(file)`: Uploads image to S3 and returns the public URL.
* `list_images()`: Fetches all image URLs from the bucket.



### Phase 5: Frontend Gallery & Fancybox Integration

* [ ] Build the unified `/gallery/` view contextually driven by the session `role`.
* **Admin Mode:** Renders a drag-and-drop file upload form + Image Grid.
* **Guest Mode:** Renders *only* the Image Grid.


* [ ] Include Fancybox CDN links in the HTML base header:
```html
<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css" />

```


* [ ] Initialize Fancybox markup syntax within the template:
```html
<a href="{{ image.image_url }}" data-fancybox="gallery" data-caption="Uploaded at {{ image.uploaded_at }}">
  <img src="{{ image.image_url }}" class="w-full h-48 object-cover rounded" />
</a>

```


* [ ] Bind initialization via JavaScript: `Fancybox.bind("[data-fancybox='gallery']", {});`.

---

## 6. Claude Code Review Focus Areas

When submitting this implementation code to Claude for review, verify the following metrics:

1. **Session Security:** Ensure views are protected by custom middleware or decorator checks guaranteeing that unauthenticated users cannot access `/gallery/` directly without a session role.
2. **S3 Exception Handling:** Check if `boto3` operations fail gracefully without crashing the application thread if the AWS server becomes unreachable.
3. **Non-blocking Request Handling:** Confirm that the Telegram notification API call does not bottleneck the page load time for the Guest user (consider utilizing a background thread or a quick timeout settings configuration).