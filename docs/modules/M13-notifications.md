# M13 — Notifications

## Overview

Phase 13 adds an in-app notification system with unread count badge in the header.

## Schema

`Notification` — `userId`, `type: NotificationType` (NEW_MESSAGE/LISTING_APPROVED/LISTING_REJECTED/LISTING_EXPIRING/NEW_REVIEW/SYSTEM), `title`, optional `body`, optional `data: Json`, `readAt: DateTime?`.

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/notifications` | JWT | Latest 50 notifications + unreadCount |
| GET | `/notifications/unread-count` | JWT | `{ count: number }` |
| PATCH | `/notifications/:id/read` | JWT | Mark one as read (204) |
| PATCH | `/notifications/read-all` | JWT | Mark all as read (204) |

## Frontend

- Header bell icon — shows real unread count badge (30s polling via `useUnreadCount`)
- `/dashboard/notifications` — notification list, unread items highlighted blue, click-to-read
- "Mark all read" button
- `useNotifications()` — 30s polling, `enabled: isAuthenticated`
- `useUnreadCount()` — 30s polling, 15s staleTime
- `useMarkRead()`, `useMarkAllRead()`

## Creating Notifications

Use `NotificationsService.create(userId, type, title, body?, data?)` from any module that imports `NotificationsModule`. The module exports the service.
