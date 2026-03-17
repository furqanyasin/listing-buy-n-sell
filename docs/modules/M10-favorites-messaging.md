# M10 — Favorites & Messaging

## Overview

Phase 10 adds two features: a favorites (saved cars) system and an in-app messaging system between buyers and sellers.

## Favorites

### Schema
`Favorite` has a `@@unique([userId, listingId])` constraint — toggle is a simple check-then-create/delete.

### API
| Method | Path | Description |
|--------|------|-------------|
| POST | `/favorites/:listingId` | Toggle (add if absent, remove if present) → `{ isFavorited }` |
| GET | `/favorites` | Saved listings as `ListingCard[]` |
| GET | `/favorites/ids` | Just the IDs (`string[]`) for client-side state |

### Frontend
- `useFavoriteIds()` — fetches IDs, `enabled: isAuthenticated`, staleTime 5m
- `useToggleFavorite()` — optimistic update: flips the ID in the cache immediately, rolls back on error
- `ListingCard` — now `'use client'`, shows heart button (top-right of image) when authenticated; `e.preventDefault()` + `e.stopPropagation()` prevents link navigation
- `/dashboard/saved` — full grid of saved listings

## Messaging

### Schema
- `Conversation` — `@@unique([listingId, buyerId])` — one conversation per buyer per listing
- `Message` — `readAt: DateTime?` for read receipts

### Business Rules
- A user cannot start a conversation about their own listing
- `findOrCreate` is idempotent — returns existing conversation ID if one exists
- `sendMessage` also touches `conversation.updatedAt` (in a `$transaction`) so the list stays sorted
- `markRead` updates all messages where `senderId != userId` and `readAt IS NULL`
- `unreadCount` uses Prisma filtered `_count`: `{ messages: { where: { readAt: null, senderId: { not: userId } } } }`

### API
| Method | Path | Description |
|--------|------|-------------|
| POST | `/conversations` | Find-or-create → `{ id, isNew }` |
| GET | `/conversations` | All conversations (buyer + seller) with last message |
| GET | `/conversations/:id` | Full thread with all messages |
| POST | `/conversations/:id/messages` | Send message |
| PATCH | `/conversations/:id/read` | Mark incoming as read (204) |

### Frontend
- `useConversations()` — 15s polling for the list
- `useConversation(id)` — 3s polling for thread updates
- `useSendMessage(id)` — invalidates both thread and list caches on success
- `useMarkRead(id)` — fires when thread opens (unreadCount > 0) and on new messages
- `/dashboard/messages` — conversation list with thumbnail, other party name, last message preview, unread badge
- `/dashboard/messages/[id]` — message bubbles (mine right/blue, theirs left/grey), auto-scroll to bottom, Enter to send, Shift+Enter for newline
- "Chat with Seller" button on listing detail — redirects to login if unauthenticated, else creates/finds conversation and navigates
