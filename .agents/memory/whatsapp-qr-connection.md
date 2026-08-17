---
name: WhatsApp QR connection
description: WhatsApp Web is connected through a QR-based Baileys session rather than the official Cloud API.
---

WhatsApp QR linking uses an unofficial WhatsApp Web session. The server persists the multi-file auth state and exposes QR, connected, disconnected, and error states to the dashboard.

**Why:** The product requirement is phone-based QR linking without Phone Number IDs or Meta access tokens.

**How to apply:** Treat QR connection and message synchronization as separate capabilities; warn users that unofficial WhatsApp Web automation can be restricted by WhatsApp.