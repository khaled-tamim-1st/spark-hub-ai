---
name: Development schema initialization
description: The Replit preview database does not automatically receive Drizzle tables before the first API request.
---

The development Drizzle schema must be pushed before testing registration or other database-backed API routes; otherwise requests fail with PostgreSQL `relation does not exist`.

**Why:** The API workflow starts independently from database schema setup and does not run migrations at startup.

**How to apply:** After schema changes or a fresh workspace, run the workspace database push before exercising authenticated API flows. Production schema changes should follow the publish flow.